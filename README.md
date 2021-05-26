# SideEffects2
New version of SideEffects using ReactNative.  Supports both Android and iOS.  Also uses current side effect data

Procedure for installing a new version of the database:

1. In Google Sheets, export the new database to .csv
2. In phpMyAdmin, copy the current database to a backup and delete the current database
3. In phpMyAdmin, import the new database from the .csv file
4. Test locally using the new database
5. Log into Bluehost
6. Make a copy of the current database and delete the current database.
7. Upload the new database
8. If the code is not pointing to the server database, make it point to the server database.
