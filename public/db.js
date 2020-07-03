let db;
// created a new db request for a budget database
const request = indexedDB.open('budget', 1)

request.onupgradeneeded = function(evt) {
    const db = evt.target.result
    db.createObjectStore('pending', { autoIncrement: true })
}

request.onsuccess = function(evt) {
    db = evt.target.result;
    
    // check if app is online before reading from db
    if(navigator.onLine) {
        checkDatabase()
    }
}

request.onerror = function(evt) {
    console.log("There was an error" + evt.target.errorCode);
  };


function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(['pending'], 'readwrite')

    const store = transaction.objectStore('pending')

    // add a record to your store with add method
    store.add(record)

}

function checkDatabase() {
    // open a transaction on your pending db
    const transaction = db.transaction(['pending'], 'readwrite')
    const store = transaction.objectStore('pending')
    const getAll = store.getAll()

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(() => {

                // if successfull, open a transaction on your pending db
                const transaction = db.transaction(['pending'], 'readwrite')

                // access your pending object store
                const store = transaction.objectStore('pending')
                store.clear()
            })
        }
    }
}


window.addEventListener('online', checkDatabase)