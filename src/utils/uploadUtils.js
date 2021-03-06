import { getBlock } from './commonUtils';

let registeredListeners = false;
const MAX_RETRIES = 2;

export { getBlock } from './commonUtils';

export function formDataUploader(
  dataToUpload,
  formSchema,
  mergeObj,
  submitUrl,
  submitMethod,
  mediaUploadUrl,
  serviceWorkerUrl
) {
  initializeDB().then(function() {
    checkIndexedDB()
      .then(function() {
        initializeServiceWorker();
      })
      .catch(function(msg) {
        console.log(msg);
      });
  });

  function initializeServiceWorker() {
    if (serviceWorkerUrl && navigator.serviceWorker) {
      navigator.serviceWorker
        //.register('./dist/serviceworker.js')
        .register(serviceWorkerUrl)
        .then(function() {
          return navigator.serviceWorker.ready;
        })
        .then(function(registration) {
          saveData().then(function() {
            if (registration.sync) {
              console.log(
                'Service worker registered, background sync available, registering sync..'
              );
              registration.sync.register('formDataSync').catch(function(err) {
                return err;
              });
            } else {
              console.log(
                'Service worker registered, background sync NOT available, checking for internet now ..'
              );
              // sync isn't there so fallback
              checkInternet();
            }
          });
        });
    } else {
      saveData().then(function() {
        checkInternet();
      });
    }
  }

  function saveData() {
    return new Promise(function(resolve, reject) {
      var tmpObj = {
        requestParams: {
          submitUrl: submitUrl,
          submitMethod: submitMethod,
          mediaUploadUrl: mediaUploadUrl,
          mergeObj: mergeObj,
          formSchema: formSchema
        },
        data: dataToUpload,
        id: Date.now()
      };

      var myDB = window.indexedDB.open('formData', 1);

      myDB.onsuccess = function(event) {
        var objStore = this.result
          .transaction(['formDataObjStore'], 'readwrite')
          .objectStore('formDataObjStore');
        objStore.add(tmpObj);
        resolve();
      };

      myDB.onerror = function(err) {
        reject(err);
      };
    });
  }

  function fetchData() {
    return new Promise(function(resolve, reject) {
      var myDB = window.indexedDB.open('formData', 1);

      myDB.onsuccess = function(event) {
        this.result
          .transaction(['formDataObjStore'])
          .objectStore('formDataObjStore')
          .getAll().onsuccess = function(event) {
          resolve(event.target.result[0]);
        };
      };

      myDB.onerror = function(err) {
        reject(err);
      };
    });
  }

  function sendData() {
    fetchData()
      .then(function(response) {
        // send request

        return manageDataSendToServer(
          response.requestParams.submitUrl,
          response.requestParams.submitMethod,
          response.requestParams.mediaUploadUrl,
          response.data,
          response.requestParams.formSchema,
          response.requestParams.mergeObj
        );
      })
      .then(clearData)
      .catch(function(err) {
        console.log(err);
      });
  }

  function clearData() {
    return new Promise(function(resolve, reject) {
      var db = window.indexedDB.open('formData', 1);
      db.onsuccess = function(event) {
        this.result
          .transaction(['formDataObjStore'], 'readwrite')
          .objectStore('formDataObjStore')
          .clear();

        resolve();
      };

      db.onerror = function(err) {
        reject(err);
      };
    });
  }

  function checkInternet() {
    event.preventDefault();
    if (navigator.onLine) {
      sendData();
    } else {
      // alert(
      //   "You are offline! When your internet returns, we'll finish up your request."
      // );
    }
  }

  function checkIndexedDB() {
    return new Promise((resolve, reject) => {
      if (navigator.onLine) {
        var formDataDB = window.indexedDB.open('formData', 1);
        formDataDB.onsuccess = function(event) {
          let db = event.target.result;
          db.onerror = function(event) {
            console.log('Database error: ' + event.target.errorCode);
          };
          if (!db.objectStoreNames.contains('formDataObjStore')) {
            return;
          }
          db
            .transaction(['formDataObjStore'], 'readwrite')
            .objectStore('formDataObjStore')
            .getAll().onsuccess = function(event) {
            if (event.target.result.length > 0) {
              reject(
                'Found data in indexedDB and internet is there at the moment, trying upload'
              );
              const requestObj = event.target.result[0];
              manageDataSendToServer(
                requestObj.requestParams.submitUrl,
                requestObj.requestParams.submitMethod,
                requestObj.requestParams.mediaUploadUrl,
                requestObj.data,
                requestObj.requestParams.formSchema,
                requestObj.requestParams.mergeObj
              )
                .then(function(rez) {
                  return rez;
                })
                .then(function(response) {
                  console.log('Form upload completed. Clearing data..');
                  formDataDB.result
                    .transaction(['formDataObjStore'], 'readwrite')
                    .objectStore('formDataObjStore')
                    .clear();
                })
                .catch(function(err) {
                  console.log('err ', err);
                });
            } else {
              resolve(
                'No existing entry in indexedDB found, go ahead with serviceWorker'
              );
            }
          };
        };

        formDataDB.onerror = console.error;
      } else {
        resolve('No internet at the moment. Go ahead with serviceWorker flow.');
      }
    });
  }

  if (!registeredListeners) {
    registeredListeners = true;
    window.addEventListener('online', function() {
      if (!navigator.serviceWorker && !window.SyncManager) {
        fetchData().then(function(response) {
          if (response.length > 0) {
            return sendData();
          }
        });
      }
    });

    window.addEventListener('offline', function() {
      // alert('You have lost internet access!');
    });
  }
}

function initializeDB() {
  return new Promise((resolve, reject) => {
    var formDataDB = window.indexedDB.open('formData', 1);

    formDataDB.onupgradeneeded = function(event) {
      var db = event.target.result;
      if (!db.objectStoreNames.contains('formDataObjStore')) {
        var formDataObjStore = db.createObjectStore('formDataObjStore', {
          autoIncrement: true
        });
        formDataObjStore.createIndex('id', 'id', { unique: true });
      }
      resolve();
    };

    formDataDB.onsuccess = function(event) {
      resolve();
    };
  });
}

export function manageDataSendToServer(
  submitUrl,
  submitMethod,
  mediaUploadUrl,
  data,
  formSchema,
  mergeObj
) {
  let retryCount = 0;

  async function executeFormUpload(
    submitUrl,
    mediaUploadUrl,
    data,
    formSchema,
    mergeObj
  ) {
    let block,
      result,
      failed = false;

    for (let id in data) {
      block = getBlock(formSchema, id);
      if (block && block.type === 'imagesWithTags') {
        console.log('Found media files. Uploading one by one..');

        const value = data[id];
        for (let i = 0; i < value.length; i++) {
          result = await manageFileUpload(mediaUploadUrl, value[i].fileUrl);
          if (result !== -1) {
            value[i]['fileUrl'] = result;
          } else {
            failed = true;
          }
        }
      }
    }

    if (failed) {
      console.log('File upload failed. Rejecting now, can try again later');
      return Promise.reject({ status: 'FAILURE' });
    }

    const finalData = Object.assign({ mdata: data }, mergeObj);

    fetch(submitUrl, {
      method: submitMethod,
      body: JSON.stringify(finalData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function(response) {
        if (response.status !== 200) {
          console.log(
            'Looks like there was a problem. Status Code: ' + response.status
          );
          return Promise.reject(response);
        } else {
          return Promise.resolve(response);
        }
      })
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
        return Promise.reject(response);
      });
  }

  return executeFormUpload(
    submitUrl,
    mediaUploadUrl,
    data,
    formSchema,
    mergeObj
  );

  async function manageFileUpload(url, fileUrl) {
    try {
      const result = await getFileBlobAndUpload(url, fileUrl);
      console.log(result);

      if (result.performed && result.data.success) {
        return result.data.url;
      } else {
        return -1;
      }
    } catch (err) {
      console.log(err);

      return -1;
    }
  }

  function getFileBlobAndUpload(url, fileUrl) {
    return fetch(fileUrl)
      .then(res => res.blob())
      .then(blob => uploadFile(url, blob));
  }

  function uploadFile(url, fileData) {
    console.log(fileData);
    console.log('Media file uploading now...');
    /*
      {
        "performed": true,
        "accessed-existing-entities": [],
        "data": {
          "success": true,
          "url": "/api/media/5dd8cbd08616d94cdefe1eda/thumbnail"
        }
      }
    */

    const formData = new FormData();
    formData.append('file', fileData);

    return fetch(url, {
      method: 'POST',
      body: formData
    })
      .then(checkStatus)
      .then(parseJSON);
  }
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
