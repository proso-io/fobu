import { getBlock } from './commonUtils';

let registeredListeners = false;

export function formDataUploader(
  submitUrl,
  dataToUpload,
  formSchema,
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
        requestParams: { submitUrl: submitUrl, formSchema: formSchema },
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

        return manageDataSendToServer(submitUrl, response.data, formSchema);
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
      alert(
        "You are offline! When your internet returns, we'll finish up your request."
      );
    }
  }

  function checkIndexedDB() {
    return new Promise((resolve, reject) => {
      if (navigator.onLine) {
        var formDataDB = window.indexedDB.open('formData', 1);
        formDataDB.onsuccess = function(event) {
          let db = event.target.result;
          db.onerror = function(event) {
            alert('Database error: ' + event.target.errorCode);
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
                requestObj.data,
                requestObj.requestParams.formSchema
              )
                .then(function(rez) {
                  return rez.text();
                })
                .then(function(response) {
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
      alert('You have lost internet access!');
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

export function manageDataSendToServer(url, data, formSchema) {
  return new Promise((resolve, reject) => {
    const updatedData = executeFormUpload(url, data, formSchema);
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(updatedData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function(response) {
        if (response.status !== 200) {
          console.log(
            'Looks like there was a problem. Status Code: ' + response.status
          );
          reject(response.status);
        } else {
          resolve(response);
        }
      })
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
        reject(err);
      });
  });
}

async function executeFormUpload(url, data, formSchema) {
  let block, result;
  for (let id in data) {
    block = getBlock(formSchema, id);
    if (block && block.type === 'imagesWithTags') {
      block.value.forEach((image, index) => {
        result = manageFileUpload(image.fileUrl);
        data[id][index]['fileUrl'] = result;
      });
    }
  }
  return data;
}

async function manageFileUpload(fileUrl) {
  const result = await uploadFile(url, fileUrl);
  return result;
}

function uploadFile(url, fileData) {
  console.log('Media file found, uploading now...');
  return fetch(url, {
    method: 'POST',
    body: fileData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
