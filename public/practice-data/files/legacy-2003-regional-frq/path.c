/**********************************
 ** File:       dir_path.c	 **
 ** Programmer: Marc Douet       **
 ** Date:       12/10/02         **
 **********************************/

#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <malloc.h>
#include <string.h>

#define DIR_LENGTH	102	/* Max size of the directory tree string.		*/
#define ROOT_DIR	0	/* Postition of the root dir in the string.		*/
#define TRUE		1	/* Macro for boolean true.				*/
#define FALSE		0	/* Macro for boolean false.				*/


/**********************
 ** Global Variables **
 **********************/

char	*dir;		/* Direcory tree read in from input.				*/
char	*path;		/* Path within directory to search for.				*/
char	*saveTree;	/* A copy of the dir tree, needed cause of strtok().		*/
int	treeLevel;	/* The level of the dir tree we're currently traversing.	*/



/***************************************************************************
* Function:  HandleError
*
* Synopsis:  void HandleError(void)
*
* Description:  Called whenever an error occurs in the main logic to free
*               up any allocated memory, and exit with 1.
*
* Return Value:  None.
***************************************************************************/
void HandleError()
{
	/* If memory is allocated for the directory tree, free it.	*/
	if(dir != NULL)
		free(dir);

	/* If memory is allocated for the directory path, free it.	*/
	if(path != NULL)
		free(path);

	/* If memory is allocated for the save  tree, free it.      	*/
        if(saveTree != NULL)
                free(saveTree);   

	/* There's no turning back now, so let's exit 1. 		*/
	exit(1);
}


/***************************************************************************
* Function:  travDir
*
* Synopsis:  int travDir(char *theDir)
*
*	*theDir		[IN]	The dir to traverse in the directory tree.
*
* Description:  Attempt to traverse the directory tree to the dir specified.
*
* Return Value:  If a dir that does not exist in the directory tree was
*	         found, return FALSE; else return TRUE.
***************************************************************************/
int travDir(char *theDir)
{
	int	tokenIndex;	
	char	*treePtr = saveTree;	/* Pointer to the save tree.            	*/ 
	char	*treeDir = NULL;	/* Dir of the tree at the current level.	*/

	/* Save a backup of the dir tree since strtok overwrites it each time.		*/ 
       	for(tokenIndex = 0; dir[tokenIndex] != NULL; tokenIndex++)
               	saveTree[tokenIndex] = dir[tokenIndex]; 

	/* If the dir is the current dir, there is nothing to do, return TRUE.		*/
	if(!strcmp(theDir, ".")) 
		return TRUE;

	/* If the dir is one level back, decrement the level and return TRUE.		*/
	if(!strcmp(theDir, "..")) {
		treeLevel--;

		/* If level is less than root level, set it to root level.		*/ 
		if(treeLevel < ROOT_DIR)
			treeLevel = ROOT_DIR;

		return TRUE;
	}

	/* If we've gotten here, we must be traversing forward one dir.			*/
	treeLevel++;

	/* Look up the dir at the current level in the dir tree...			*/
	for(tokenIndex = 0; tokenIndex < treeLevel; tokenIndex++) {
		treeDir = NULL;
		treeDir = strtok(treePtr, "/");
		treePtr = NULL;
	}

	/* If the dir we are traversing to is the dir at the current tree level,*/
	/* this path is valid, so return TRUE.						*/
	if(!strcmp(theDir, treeDir)) 
		return TRUE;

	/* Else this is an invalid dir, so return FALSE.				*/
	else 	return FALSE;
}


/***************************************************************************
* Function:  printDirPath
*
* Synopsis:  void printDirPath(void)
*
* Description:  Determine what directory in the directory tree the path
*	 	    leads to and print it.
*
* Return Value:  None.
***************************************************************************/
void printDirPath()
{
	int	 tokenIndex;
	char	*pathPtr = path;	/* Pointer to the path.				*/
	char	*dirPtr = dir;		/* Pointer to the dir tree.			*/
	char	*currDir = NULL;	/* Current dir we are traversing.		*/
	char	*pathTokens[DIR_LENGTH/2];/* List of path tokens.			*/
	int	 numPathTokens = 0;	/* Number of path tokens.			*/

	treeLevel = ROOT_DIR;           /* Start in the root directory.     		*/

	/* Allocate space for each of the path tokens.					*/
	for(tokenIndex = 0; tokenIndex < DIR_LENGTH/2; tokenIndex++) {
		if((pathTokens[tokenIndex] = malloc(DIR_LENGTH/2)) == NULL) {
                	printf("Error: Unable to malloc %d bytes for path token.\n",
                       		DIR_LENGTH/2);
                	HandleError();
		}
	}

	/* Get the path tokens by tokenizing the path.  Note that the path  		*/
     	/* pointer is set to null after the first call to the tokenizer,        	*/
     	/* this is because that after the first call, the path is stored        	*/
     	/* internally by the tokenizer call.                                    	*/ 
	for(tokenIndex = 0; (currDir = strtok(pathPtr, "/")) != NULL; tokenIndex++) {
		pathTokens[tokenIndex] = currDir;
		currDir = NULL;
		pathPtr = NULL;
	}

	/* Set the number of path tokens we have found.					*/
	numPathTokens = tokenIndex;	

	/* Grab each path token and traverse that dir.  				*/
	for(tokenIndex = 0; tokenIndex < numPathTokens; tokenIndex++) {
		/* If the path was not found in the directory tree, exit.		*/
		if(!travDir(pathTokens[tokenIndex])) {
			printf("INVALID DIRECTORY\n");
			return;
		}
	}

	/* If we got here, the path was ok, so print the dir at the dir tree		*/
	/* level we are currently in after traversing the path.				*/
	for(tokenIndex = 0; tokenIndex < treeLevel; tokenIndex++) {
		printf("/%s", strtok(dirPtr, "/"));
		dirPtr = NULL;
	}

	/* IF we ended up in the root dir, just print one '/'.				*/
	if(treeLevel == ROOT_DIR) {
		printf("/");
	}

	printf("\n");

	/* Deallocate space for each of the path tokens.                     		*/
        for(tokenIndex = 0; tokenIndex < DIR_LENGTH/2; tokenIndex++) {
                if(pathTokens[tokenIndex] != NULL) 
			free(pathTokens[tokenIndex]);
        }       
}


/***************************************************************************
* Function:  main
*
* Synopsis:  main(void)
*
* Description:  Main driver of the program.  Consists of a loop that
*               through each iteration:
* 		    	1.  Reads in a tree/path pair.
*			2.  Calls printDirPath() to print the final dir path.
*			3.  If another tree/path pair exists, continue.
*			4.  If another tree/path pair does not exist,
*              	            break out of the loop and exit.
*
* Return Value:  Exit 0 if success, exit 1 if error was encountered.
***************************************************************************/
main()
{
	/* Try to allocate memory to hold the directory tree.				*/
	if((dir = (char*)malloc(DIR_LENGTH)) == NULL) {
		printf("Error: Unable to malloc %d bytes for directory tree.\n",
			DIR_LENGTH);
		HandleError();
	}

	/* Try to allocate memory to hold the directory path.				*/
	if((path = (char*)malloc(DIR_LENGTH)) == NULL) {
		printf("Error: Unable to malloc %d bytes for directory path.\n",
			DIR_LENGTH);
		HandleError();
	}

	/* Try to allocate memory to hold the save tree.      	         		*/
	if((saveTree = malloc(DIR_LENGTH)) == NULL) {
                printf("Error: Unable to malloc %d bytes for save tree.\n",
                        DIR_LENGTH);
                HandleError();
        }     

	/* Read in the directory tree and path from input.				*/
	scanf("%s %s", dir, path);

	/* WHILE we have a directory tree and path...					*/
	while(strcmp(dir, "\0") && strcmp(path, "\0")) {
		/* Determine and print the path name the dir path leads to.		*/
		printDirPath();

		/* Clear the directory tree, path, and save tree  strings.		*/
		memset((void *)dir, '\0', DIR_LENGTH);
		memset((void *)path, '\0', DIR_LENGTH);
		memset((void *)saveTree, '\0', DIR_LENGTH); 

		/* Read in another set of directory tree and path strings.		*/
		scanf("%s %s", dir, path);
	}

	/* We're done, so let's free up all allocated memory and exit.			*/
	if(dir != NULL)
		free(dir);
	if(path != NULL)
		free(path);
	if(saveTree != NULL)
		free(saveTree);
	exit(0);
}
