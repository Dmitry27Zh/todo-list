const copyObjectWithJSON = (object) => {
  return JSON.parse(JSON.stringify(object))
}

const forEachOwnProperty = (object, cb) => {
  for (let prop in object) {
    if (object.hasOwnProperty(prop)) {
      cb(prop, object, object[prop])
    }
  }
}

const deleteUncontainedProperties = (targetObject, sampleObject) => {
  forEachOwnProperty(targetObject, (prop, object) => {
    if (!(prop in sampleObject)) {
      delete object[prop]
    }
  })
}

const mergeObjects = (targetObject, sampleObject) => {
  forEachOwnProperty(sampleObject, (prop, object) => {
    targetObject[prop] = object[prop]
  })
}

const replaceAllObjectProperties = (targetObject, sampleObject) => {
  deleteUncontainedProperties(targetObject, sampleObject)
  mergeObjects(targetObject, sampleObject)
}

export { copyObjectWithJSON, forEachOwnProperty, deleteUncontainedProperties, replaceAllObjectProperties }
