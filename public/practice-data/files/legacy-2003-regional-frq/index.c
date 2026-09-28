/**********************************
 ** File:       index.c		   **
 ** Programmer: Marc Douet       **
 ** Date:       12/10/02         **
 **********************************/

#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <malloc.h>
#include <string.h>

#define CHAPTER_SIZE	21	/* Max size of the chapter string.	*/
#define MAX_INDICES	100	/* Max number of pages to index.	*/
#define TRUE		1	/* Macro for boolean true.		*/
#define FALSE		0	/* Macro for boolean false.		*/


/**********************
 ** Global Variables **
 **********************/

char	*tag;			/* String to hold the START/END tag.		*/
char	*chapter;		/* String to hold the chapter title.		*/
int	 numPageNumbers;	/* Number of page numbers read in.			*/
int 	 pageNumbers[MAX_INDICES];/* List of page numbers to be indexed.	*/



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
    	/* If memory is allocated for the START/END tag, free it. 	*/
	if(tag != NULL)
		free(tag);

	/* If memory is allocated for the chapter string, free it. 	*/
	if(chapter != NULL)
		free(chapter);

	/* There's no turning back now, so let's exit 1. 		*/
	exit(1);
}


/***************************************************************************
 * Function:  buildIndex
 *
 * Synopsis:  void buildIndex(void)
 *
 * Description:  Prints out an index of all of the page numbers.
 *
 * Return Value:  None.
 ***************************************************************************/  
void buildIndex()
{
	int	index;
	int 	prevNum = -1;
	int 	IsConsecNum = FALSE;
	
	/* Print the chapter title.								*/
	printf("%s,", chapter);

	/* For every page number in the list...						*/
	for(index = 0; index < numPageNumbers; index++) {
		/* If this number is consecutive to the previous number and this	*/
		/* is the first consecutive number, set the flag.			*/
		if(((prevNum+1) == pageNumbers[index])) {
			if(!IsConsecNum) {
				IsConsecNum = TRUE;
			}
		}

		/* Else if this is not a consecutive number, but the last number	*/
		/* was, print the following and turn off the flag.			*/
		else if(IsConsecNum) {
			printf("-%d,%d", prevNum, pageNumbers[index]);
			IsConsecNum = FALSE;
		}

		/* Else if this is the first number in the list, just print the	*/
		/* number by itself, since we don't know what comes next.		*/
		else {
			if(prevNum == -1) {
				printf("%d", pageNumbers[index]);
			}

			/* This is not a consectutive number, and not the first number,	*/
			/* so print a comma and the number.						*/
			else {
				printf(",%d", pageNumbers[index]);
			}
		}

		/* Save a copy of this number for future reference.				*/
		prevNum = pageNumbers[index];
	}

	/* If we have gone through the whole list and were had an unfinished		*/
	/* series, print the hyphen and the last number in the list.			*/
	if(IsConsecNum) {
			printf("-%d", prevNum);
	}

	printf("\n");
}


/***************************************************************************
 * Function:  main
 *
 * Synopsis:  main(void)
 *
 * Description:  Main driver of the program.  Consists of a loop that 
 *               through each iteration:
 * 			1.  Reads in a "START" string, chapter, page number
 *                    count, and page number list.
 *			2.  Calls buildIndex() to build and print the index
 *                    of page numbers on the list.
 *			3.  If another "START" string exists, continue.
 *			4.  If another "START" string does not exist,
 *              	    break out of the loop and exit.
 *
 * Return Value:  Exit 0 if success, exit 1 if error was encountered.
 ***************************************************************************/ 
main()
{
	int index;

	/* Try to allocate memory to hold the START/END	tag using the 	*/
     	/* size of the bigger tag (START).						*/
	if((tag = (char*)malloc(sizeof("START"))) == NULL) {
		printf("Error: Unable to malloc %d bytes for START/END tag.\n", 
			sizeof("START"));
		HandleError();
	}

	/* Try to allocate memory to hold the chapter.				*/
	if((chapter = (char*)malloc(CHAPTER_SIZE)) == NULL) {
		printf("Error: Unable to malloc %d bytes for chapter string.\n", 
			CHAPTER_SIZE);
		HandleError();
	}

	/* Read in the START tag, chapter, and number of page numbers.	*/
	scanf("%s %s %d", tag, chapter, &numPageNumbers);

	/* WHILE we have found a START tag...					*/
	while(!strcmp(tag, "START")) {
		/* Read in the pages to be indexed.					*/
		for(index = 0; index < numPageNumbers; index++) 
			scanf("%d", &pageNumbers[index]);

		/* Clear out the START/END tag to read in the END tag.	*/
		memset((void *)tag, '\0', sizeof(tag));
 
		/* Read in the END tag. 						*/
		scanf("%s", tag);  

		/* IF an END tag was not found, print an error, and exit 1.	*/
		if(strcmp(tag, "END")) {
			printf("Error: No END tag was found after the data.\n");
			HandleError();
		}

		/* Build and print the index of page numbers.			*/
		buildIndex();

		/* Clear the START/END tag and chapter string.			*/
		memset((void *)tag, '\0', sizeof("START"));
		memset((void *)chapter, '\0', CHAPTER_SIZE);

		/* Try to read in another tag, chapter, and number of pages.*/
		scanf("%s %s %d", tag, chapter, &numPageNumbers);
	}

	/* We're done, so let's free up all allocated memory and exit	*/
	if(tag != NULL)
		free(tag);
	if(chapter != NULL)
		free(chapter);
	exit(0);
}

