// log.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include "iostream.h"
#include "string.h"
#include <stdlib.h>

#define MAX_BACKUP_ENTRIES 10
#define MAX_LOG_ENTRIES 10
#define MAX_DB_ENTRIES MAX_BACKUP_ENTRIES + MAX_LOG_ENTRIES

#define MAX_DBS 100

#define MAX_NAME_LEN 20

#define DB_TOKEN "DATABASE"
#define LOG_TOKEN "LOG"

#define INSERT_TOKEN "Insert"
#define DELETE_TOKEN "Delete"
#define UPDATE_TOKEN "Update"

typedef struct dbEntry {
	char name[MAX_NAME_LEN+1];
	int  value;
} dbEntry_t;

int indexOf(char token[], dbEntry db[], int numEntries);
int compare (const void *arg1, const void *arg2);

int main(int argc, char* argv[])
{
	char token[MAX_NAME_LEN+1];	

	dbEntry_t db[MAX_DB_ENTRIES];

	int dbNum, prevDbNum = 0;
	int numEntries;
	int index;
	int value;

	cin >> token;

	while (cin)
	{
		cin >> dbNum;

		if (dbNum != prevDbNum + 1)
		{
			cout << "ERROR: Databases are not sequentially ordered; database number is " << dbNum << endl;
			return -1;
		}

		if (dbNum > MAX_DBS)
		{
			cout << "ERROR: Too many databases" << endl;
			return -1;
		}

		numEntries = 0;

		cin >> token;

		while (strcmp(token, LOG_TOKEN) != 0)
		{
			if (numEntries >= MAX_BACKUP_ENTRIES)
			{
				cout << "ERROR: Too many backup entries";
				return -1;
			}

			strcpy(db[numEntries].name, token);
			cin >> db[numEntries++].value;
			
			cin >> token;
		}

		cin >> token;

		while (cin && strcmp(token, DB_TOKEN) != 0)
		{
			if (!strcmp(token, INSERT_TOKEN))
			{
				cin >> db[numEntries].name;
				cin >> db[numEntries++].value;
			}
			else if (!strcmp(token, DELETE_TOKEN))
			{
				cin >> token;

				index = indexOf(token, db, numEntries);

				if (index == -1)
					return -1;

				memcpy(&db[index], &db[--numEntries], sizeof(dbEntry_t));
			}
			else if (!strcmp(token, UPDATE_TOKEN))
			{
				cin >> token >> value;

				index = indexOf(token, db, numEntries);

				if (index == -1)
					return -1;

				db[index].value = value;
			}
			else
			{
				cout << "ERROR: Invalid transaction log entry type: " << token << endl;
				return -1;
			}
			cin >> token;
		}

		cout << "DATABASE " << dbNum << endl;

		if (numEntries > 0)
			qsort(db, numEntries, sizeof(dbEntry_t), compare);

		for (index = 0; index < numEntries; index++)
			cout << db[index].name << " " << db[index].value << endl;

		prevDbNum = dbNum;
	}

	return 0;
}

int indexOf(char token[], dbEntry_t db[], int numEntries)
{
	int i;
	bool entryFound;

	for (i = 0, entryFound = false; i < numEntries; i++)
	{
		if (!strcmp(db[i].name, token))
		{
			entryFound = true;
			break;
		}
	}

	if (!entryFound)
	{
		cout << "ERROR: Invalid operation for non-existent entry: " << token << endl;
		return -1;					
	}

	return i;
}

int compare (const void *arg1, const void *arg2)
{
   return strcmp( ((dbEntry_t*) arg1)->name,  ((dbEntry_t*) arg2)->name );
}