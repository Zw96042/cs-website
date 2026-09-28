/**********************************
** File:       fastfingers.c    **
** Programmer: Marc Douet       **
** Date:       12/08/02         **
**********************************/

#include <stdio.h>
#include <malloc.h>

#define MESSAGE_LENGTH	201	/* Size of message to allocate.	*/
#define	NUM_FINGERS	8	/* Number of fingers we care about.	*/
#define NUM_KEYS		6	/* Max number of keys per finger.	*/
#define TRUE		1	/* Macro for boolean true.		*/
#define FALSE		0	/* Macro for boolean false.		*/



/*************************************************************
** Struct to represent postition of a key on the keyboard. **
*************************************************************/
typedef struct position {
	int row;
	int col;
} position_t;


/********************************************************************
** Info about each finger consiting of key mapping and positions. **
********************************************************************/
typedef struct finger {
	char		keys[NUM_KEYS];	/* List of keys that finger types.		*/
	position_t	keyPos[NUM_KEYS];	/* Postions of each key.			*/
	position_t	nextKeyPos;		/* Position of next key to be typed.	*/
	position_t	currKeyPos;		/* Position of the key the finger is on.	*/
	int		typeTime;		/* Time it took to type last key.		*/
} finger_t;


/******************************************
** Enumeration for each type of finger. **
******************************************/
enum		fingerTypes {	LEFT_PINKIE, LEFT_RING, LEFT_MIDDLE,
					LEFT_INDEX, RIGHT_PINKIE, RIGHT_RING,
					RIGHT_MIDDLE, RIGHT_INDEX   } fingerTypes_t;


/**********************
** Global Variables **
**********************/

char 		*tag;					/* String to hold the START/END tag.	*/
char		*message;				/* Message that Freddie has to type.	*/
int		totalTypeTime = 0;		/* Total time it takes to type.		*/
finger_t	fastFinger[NUM_FINGERS];	/* Info on each of Freddie's fingers.	*/



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

	/* If memory is allocated for the message, free it. 		*/
	if(message != NULL)
		free(message);

	/* There's no turning back now, so let's exit 1. 		*/
	exit(1);
}


/***************************************************************************
* Function:  gotoNextLine
*
* Synopsis:  void gotoNextLine(void)
*
* Description:  Advances the file pointer to the next line.  Needed since
* 		    calling scanf() does not advance the file pointer to the
*               next line after reading the last formatted data on the line.
*		    Note:  This should only be called after ALL data has been
*               read from the input line of data.
*
* Return Value:  None.
***************************************************************************/
void gotoNextLine()
{
	while(getchar() != '\n');
}


/***************************************************************************
* Function:  mapFingers
*
* Synopsis:  void mapFingers(void)
*
* Description:  Map all his fingers to keys and key positions.
*
* Return Value:  None
***************************************************************************/
void mapFingers()
{
	int fingerIndex, keyIndex;

	/* Initialize all key mappings for all fingers.				*/
	for(fingerIndex = 0; fingerIndex < NUM_FINGERS; fingerIndex++) {
		for(keyIndex = 0; keyIndex < NUM_KEYS; keyIndex++) {
			fastFinger[fingerIndex].keys[keyIndex] = '\0';
			fastFinger[fingerIndex].keyPos[keyIndex].row = -1;
			fastFinger[fingerIndex].keyPos[keyIndex].col = -1;
		}
	}

	/* Map keys and key positions to the left pinkie finger.		*/
	fastFinger[LEFT_PINKIE].keys[0] = 'a';
	fastFinger[LEFT_PINKIE].keys[1] = 'z';
	fastFinger[LEFT_PINKIE].keys[2] = 'q';
	fastFinger[LEFT_PINKIE].keyPos[0].row = 1;
	fastFinger[LEFT_PINKIE].keyPos[0].col = 0;
	fastFinger[LEFT_PINKIE].keyPos[1].row = 2;
	fastFinger[LEFT_PINKIE].keyPos[1].col = 0;
	fastFinger[LEFT_PINKIE].keyPos[2].row = 0;
	fastFinger[LEFT_PINKIE].keyPos[2].col = 0;

	/* Map keys and key positions to the left ring finger.		*/
	fastFinger[LEFT_RING].keys[0] = 's';
	fastFinger[LEFT_RING].keys[1] = 'x';
	fastFinger[LEFT_RING].keys[2] = 'w';
	fastFinger[LEFT_RING].keyPos[0].row = 1;
	fastFinger[LEFT_RING].keyPos[0].col = 1;
	fastFinger[LEFT_RING].keyPos[1].row = 2;
	fastFinger[LEFT_RING].keyPos[1].col = 1;
	fastFinger[LEFT_RING].keyPos[2].row = 0;
	fastFinger[LEFT_RING].keyPos[2].col = 1;

	/* Map keys and key positions to the left middle finger.		*/
	fastFinger[LEFT_MIDDLE].keys[0] = 'd';
	fastFinger[LEFT_MIDDLE].keys[1] = 'c';
	fastFinger[LEFT_MIDDLE].keys[2] = 'e';
	fastFinger[LEFT_MIDDLE].keyPos[0].row = 1;
	fastFinger[LEFT_MIDDLE].keyPos[0].col = 2;
	fastFinger[LEFT_MIDDLE].keyPos[1].row = 2;
	fastFinger[LEFT_MIDDLE].keyPos[1].col = 2;
	fastFinger[LEFT_MIDDLE].keyPos[2].row = 0;
	fastFinger[LEFT_MIDDLE].keyPos[2].col = 2;

	/* Map keys and key positions to the left index finger.		*/
	fastFinger[LEFT_INDEX].keys[0] = 'f';
	fastFinger[LEFT_INDEX].keys[1] = 'g';
	fastFinger[LEFT_INDEX].keys[2] = 'v';
	fastFinger[LEFT_INDEX].keys[3] = 'b';
	fastFinger[LEFT_INDEX].keys[4] = 'r';
	fastFinger[LEFT_INDEX].keys[5] = 't';
	fastFinger[LEFT_INDEX].keyPos[0].row = 1;
	fastFinger[LEFT_INDEX].keyPos[0].col = 3;
	fastFinger[LEFT_INDEX].keyPos[1].row = 1;
	fastFinger[LEFT_INDEX].keyPos[1].col = 4;
	fastFinger[LEFT_INDEX].keyPos[2].row = 2;
	fastFinger[LEFT_INDEX].keyPos[2].col = 3;
	fastFinger[LEFT_INDEX].keyPos[3].row = 2;
	fastFinger[LEFT_INDEX].keyPos[3].col = 4;
	fastFinger[LEFT_INDEX].keyPos[4].row = 0;
	fastFinger[LEFT_INDEX].keyPos[4].col = 3;
	fastFinger[LEFT_INDEX].keyPos[5].row = 0;
	fastFinger[LEFT_INDEX].keyPos[5].col = 4;

	/* Map keys and key positions to the right pinkie finger.		*/
	fastFinger[RIGHT_PINKIE].keys[0] = ';';
	fastFinger[RIGHT_PINKIE].keys[1] = '/';
	fastFinger[RIGHT_PINKIE].keys[2] = 'p';
	fastFinger[RIGHT_PINKIE].keyPos[0].row = 1;
	fastFinger[RIGHT_PINKIE].keyPos[0].col = 9;
	fastFinger[RIGHT_PINKIE].keyPos[1].row = 2;
	fastFinger[RIGHT_PINKIE].keyPos[1].col = 9;
	fastFinger[RIGHT_PINKIE].keyPos[2].row = 0;
	fastFinger[RIGHT_PINKIE].keyPos[2].col = 9;

	/* Map keys and key positions to the right ring finger.		*/
	fastFinger[RIGHT_RING].keys[0] = 'l';
	fastFinger[RIGHT_RING].keys[1] = '.';
	fastFinger[RIGHT_RING].keys[2] = 'o';
	fastFinger[RIGHT_RING].keyPos[0].row = 1;
	fastFinger[RIGHT_RING].keyPos[0].col = 8;
	fastFinger[RIGHT_RING].keyPos[1].row = 2;
	fastFinger[RIGHT_RING].keyPos[1].col = 8;
	fastFinger[RIGHT_RING].keyPos[2].row = 0;
	fastFinger[RIGHT_RING].keyPos[2].col = 8;

	/* Map keys and key positions to the right middle finger.		*/
	fastFinger[RIGHT_MIDDLE].keys[0] = 'k';
	fastFinger[RIGHT_MIDDLE].keys[1] = ',';
	fastFinger[RIGHT_MIDDLE].keys[2] = 'i';
	fastFinger[RIGHT_MIDDLE].keyPos[0].row = 1;
	fastFinger[RIGHT_MIDDLE].keyPos[0].col = 7;
	fastFinger[RIGHT_MIDDLE].keyPos[1].row = 2;
	fastFinger[RIGHT_MIDDLE].keyPos[1].col = 7;
	fastFinger[RIGHT_MIDDLE].keyPos[2].row = 0;
	fastFinger[RIGHT_MIDDLE].keyPos[2].col = 7;

	/* Map keys and key positions to the right index finger.		*/
	fastFinger[RIGHT_INDEX].keys[0] = 'j';
	fastFinger[RIGHT_INDEX].keys[1] = 'h';
	fastFinger[RIGHT_INDEX].keys[2] = 'm';
	fastFinger[RIGHT_INDEX].keys[3] = 'n';
	fastFinger[RIGHT_INDEX].keys[4] = 'u';
	fastFinger[RIGHT_INDEX].keys[5] = 'y';
	fastFinger[RIGHT_INDEX].keyPos[0].row = 1;
	fastFinger[RIGHT_INDEX].keyPos[0].col = 6;
	fastFinger[RIGHT_INDEX].keyPos[1].row = 1;
	fastFinger[RIGHT_INDEX].keyPos[1].col = 5;
	fastFinger[RIGHT_INDEX].keyPos[2].row = 2;
	fastFinger[RIGHT_INDEX].keyPos[2].col = 6;
	fastFinger[RIGHT_INDEX].keyPos[3].row = 2;
	fastFinger[RIGHT_INDEX].keyPos[3].col = 5;
	fastFinger[RIGHT_INDEX].keyPos[4].row = 0;
	fastFinger[RIGHT_INDEX].keyPos[4].col = 6;
	fastFinger[RIGHT_INDEX].keyPos[5].row = 0;
	fastFinger[RIGHT_INDEX].keyPos[5].col = 5;
}


/***************************************************************************
* Function:  initFingers
*
* Synopsis:  void initFingers(void)
*
* Description:  Used for each run to intitalize the finger info.
*
* Return Value:  None
***************************************************************************/
void initFingers()
{
	int fingerIndex;

	for(fingerIndex = 0; fingerIndex < NUM_FINGERS; fingerIndex++) {
		fastFinger[fingerIndex].nextKeyPos.row = -1;
		fastFinger[fingerIndex].nextKeyPos.col = -1;
		fastFinger[fingerIndex].currKeyPos = fastFinger[fingerIndex].keyPos[0];
		fastFinger[fingerIndex].typeTime = 0;
	}

	totalTypeTime = 0;
}


/***************************************************************************
* Function:  findFinger
*
* Synopsis:  finger_t *findFinger(char key, finger_t *keyFinger)
*
*			key		[IN]	Key to be typed
*	           *keyFinger	[OUT]	Finger that maps to key to be typed
*
* Description:  Finds the finger that types the passed in key.
*
* Return Value:  Returns a pointer to the approriate finger, NULL if no
 *               finger was found.
***************************************************************************/
finger_t *findFinger(char key)
{
	int fingerIndex, keyIndex;

	for(fingerIndex = 0; fingerIndex < NUM_FINGERS; fingerIndex++) {
		for(keyIndex = 0; keyIndex < NUM_KEYS; keyIndex++) {
			if(fastFinger[fingerIndex].keys[keyIndex] == key) {
				fastFinger[fingerIndex].nextKeyPos =
					fastFinger[fingerIndex].keyPos[keyIndex];
				return &fastFinger[fingerIndex];
			}
		}
	}

	return NULL;
}


/***************************************************************************
* Function:  getKeyTypeTime
*
* Synopsis:  void getKeyTypeTime(finger_t *currFinger)
*
*		*currFinger	[IN]	Finger that is doing the typing.
*
* Description:  Determines how long it will take the finger to type the
*               key that is next to be typed.  Sets the type time for
*               this finger, and increment the accumlated time.
*
* Return Value:  None
***************************************************************************/
void getKeyTypeTime(finger_t *currFinger)
{
	int	tempTypeTime = 0;
	int	startRow = currFinger->currKeyPos.row;
	int	startCol = currFinger->currKeyPos.col;
	int	destRow = currFinger->nextKeyPos.row;
	int	destCol = currFinger->nextKeyPos.col;

	/* Calculate this finger's typing time for this key.					*/
	tempTypeTime = ((abs((destCol - startCol) * 50)
				+ (abs(destRow - startRow)) * 50)) + 10;

	/* IF this finger has typed a key before...						*/
	if(currFinger->typeTime != 0) {
		/* IF once this finger has finished typing its previous key you were	*/
		/* not able to reach this key before the other keys were typed,		*/
		/* increment the time by the time remaining that it will take you to	*/
		/* type the key after the other keys have been typed.				*/
		if(tempTypeTime > (totalTypeTime - currFinger->typeTime)) {
			totalTypeTime += (tempTypeTime -
					  (totalTypeTime - currFinger->typeTime));
			currFinger->typeTime = totalTypeTime;
		}

		/* ELSE once this finger has finished typing its previous key you		*/
		/* were able to reach the key before the other keys have been typed,	*/
		/* then just increment the time by the time it takes to press the	key.	*/
		else {
			totalTypeTime += 10;
			currFinger->typeTime = totalTypeTime;
		}
	}

	/* ELSE IF you can reach the key before the other keys have been typed,		*/
	/* then just increment the time by the time it takes to press the key.		*/
	else if(totalTypeTime >= tempTypeTime) {
		totalTypeTime += 10;
		currFinger->typeTime = totalTypeTime;
	}

	/* ELSE you were not able to reach this key before the other keys were		*/
	/* typed, so increment the time by the time remaining that it will take 	*/
	/* you to type the key after the other keys have been typed.			*/
	else {
		totalTypeTime += (tempTypeTime - totalTypeTime);
		currFinger->typeTime = totalTypeTime;
	}

	/* Update the current position of this finger with the typed key.			*/
	currFinger->currKeyPos.row = currFinger->nextKeyPos.row;
	currFinger->currKeyPos.col = currFinger->nextKeyPos.col;
}


/***************************************************************************
* Function:  calcTypingTime
*
* Synopsis:  void calcTypingTime(void)
*
* Description:  Calculate and print the time it will take to type the message.
*
* Return Value:  None
***************************************************************************/
calcTypingTime()
{
	int		 messageIndex = 0;
	finger_t	*thisFinger = NULL;

	/* Go through each character in the message and tabulate the type time.		*/
	while(message[messageIndex] != '\0') {
		/* IF we found a space, increment the time by the time it takes to	*/
		/* type the spacebar since it is the only key the thumb types.		*/
		if(message[messageIndex] == ' ') {
			totalTypeTime += 10;
		}

		/*ELSE we have a regular key to be typed...					*/
		else {
			/* Determine which finger should type the key and calculate the	*/
			/* type time for that key and increment the total time.		*/
			if((thisFinger = findFinger(message[messageIndex])) != NULL) {
				getKeyTypeTime(thisFinger);
			}

			/* IF an error occurred while retreiving the next finger, exit.	*/
			else {
				printf("Error occured while finding next finger!\n");
				HandleError();
			}
		}

		messageIndex++;
	}

	/* Print the total time it took to type the message.					*/
	printf("%d\n", totalTypeTime);
}


/***************************************************************************
* Function:  main
*
* Synopsis:  main(void)
*
* Description:  Main driver of the program.  Consists of a loop that
*               through each iteration:
* 			1.  Reads in a message.
*			2.  Maps all keys to fingers.
*			3.  Calls calcTypTime to print the typing time.
*			4.  If another "START" string exists, continue.
*			5.  If another "START" string does not exist,
*              	    break out of the loop and exit.
*
* Return Value:  Exit 0 if success, exit 1 if error was encountered.
***************************************************************************/
main()
{
	/* Map all the keys and key positions to Freddie's fingers.			*/
	mapFingers();

	/* Try to allocate memory to hold the START/END	tag using the size of	*/
     	/* the bigger tag (START).								*/
	if((tag = (char*)malloc(sizeof("START"))) == NULL) {
		printf("Error: Unable to malloc %d bytes for START/END tag.\n",
			sizeof("START"));
		HandleError();
	}

	/* Try to allocate memory to hold the message.					*/
	if((message = (char*)malloc(MESSAGE_LENGTH)) == NULL) {
		printf("Error: Unable to malloc %d bytes for message.\n",
			MESSAGE_LENGTH);
		HandleError();
	}

	/* Read in the START tag.								*/
	scanf("%s", tag);

	/* WHILE we have found a START tag...						*/
	while(!strcmp(tag, "START")) {
		/* Read in the message to be typed.	We have to go to the next line*/
		/* because the previous scanf() call did not wrap to the next line*/
		/* and the gets() call will not parse the correct line.		*/
		gotoNextLine();
		gets(message);

		/* Clear out the START/END tag to read in the END tag.		*/
		memset((void *)tag, '\0', sizeof(tag));

		/* Read in the END tag. */
		scanf("%s", tag);

		/* IF an END tag was not found, print an error, and exit 1. 	*/
		if(strcmp(tag, "END")) {
			printf("Error: No END tag was found after the data.\n");
			HandleError();
		}

		/* Initialize the finger info for another run.				*/
		initFingers();

		/* Calculate and print the time it'll take to type the message.	*/
		calcTypingTime();

		/* Clear the START/END tag and the message.				*/
		memset((void *)tag, '\0', sizeof(tag));
		memset((void *)message, '\0', sizeof(message));

		/* Try to read in another tag.						*/
		scanf("%s", tag);
	}

	/* We're done, so let's free up all allocated memory and exit.		*/
	if(tag != NULL)
		free(tag);
	if(message != NULL)
		free(message);
	exit(0);
}


