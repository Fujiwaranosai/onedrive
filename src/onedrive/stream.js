const { map } = require('rxjs/operators');
const { DateTime } = require('luxon');
const { join } = require('path');
const delta = require('./delta');

const stream = refreshToken => (
  delta(refreshToken).pipe(
    map((file) => {
      let type;
      if ('file' in file) {
        type = 'file';
      } else if ('folder' in file) {
        type = 'folder';
      } else {
        throw new Error('Unhandled item type');
      }

      // Debug
      // return file;

      // @TODO Deal with change/move/copy/delete.
      return {
        action: 'add',
        id: file.id,
        type,
        name: join(file.parentReference.path, file.name).replace('/drive/root:/', ''),
        modified: file.lastModifiedDateTime ? DateTime.fromISO(file.lastModifiedDateTime) : null,
        hash: file.file ? file.file.hashes.sha1Hash : null,
        downloadUrl: file['@microsoft.graph.downloadUrl'] ? file['@microsoft.graph.downloadUrl'] : null,
      };
    }),
  )
);

module.exports = stream;