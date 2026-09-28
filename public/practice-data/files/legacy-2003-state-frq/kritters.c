/**********************************
 ** File:       kritters.c	 **
 ** Programmer: Marc Douet       **
 ** Date:       04/02/03         **
 **********************************/

#include <stdio.h>
#include <string.h>

#define  NUM_KRITTER_TYPES     5
#define  MAX_NUM_KRITTERS      9
#define  NUM_CAGES             9


/*
 * Info about each kritter.
 */
typedef struct kritterInfo {
    int  type;                           /* Type of kritter.                         */
    int  numNear[NUM_KRITTER_TYPES];     /* Num kritter types near this kritter.     */
    int  numToDislike[NUM_KRITTER_TYPES];/* Num kritters it takes to make this       */
                                         /* kritter dislike a corresponding          */
                                         /* disliked type of kritter.                */
} kritterInfo_t;


/* 
 * Enumeration for each type of kritter.
 */
enum kritterTypes { DOG, CAT, MOUSE, BIRD, FISH } kritterTypes_t;


/**********************
 ** Global Variables **
 **********************/

int            Cages[3][3];
kritterInfo_t  Kritters[MAX_NUM_KRITTERS];
int            NumKritters;
FILE          *inputFile = NULL;


/***************************************************************************
 * Function:  AddCritters
 *
 * Synopsis:  void AddKritters(int  row,  [IN] The row of the cage.    
 *                             int  col,  [IN] The column of the cage. 
 *                             char type) [IN] The type of kritter.
 *
 * Description:  Adds a kritter to the kritter table and adds it to its
 *               appropriate cage. 
 *
 * Return Value:  None.
 ***************************************************************************/
void AddKritters(int row, int col, char type)
{

  switch(type) {
      case 'D':  /* Dogs dislike 2 or more dogs and 1 or more cat.         */
                 Kritters[NumKritters].type = DOG;
                 Kritters[NumKritters].numToDislike[DOG] = 2;
                 Kritters[NumKritters].numToDislike[CAT] = 1;
                 break;

      case 'C':  /* Cats dislike 1 or more dog, mouse, bird, or fish.      */
                 Kritters[NumKritters].type = CAT;
                 Kritters[NumKritters].numToDislike[DOG] = 1;
                 Kritters[NumKritters].numToDislike[MOUSE] = 1;
                 Kritters[NumKritters].numToDislike[BIRD] = 1;
                 Kritters[NumKritters].numToDislike[FISH] = 1;
                 break;

      case 'M':  /* Mice dislike 1 or more cat.                            */
                 Kritters[NumKritters].type = MOUSE;
                 Kritters[NumKritters].numToDislike[CAT] = 1;
                 break;

      case 'B': /* Birds dislike 1 or more cat, or fish.                  */
                 Kritters[NumKritters].type = BIRD;
                 Kritters[NumKritters].numToDislike[CAT] = 1;
                 Kritters[NumKritters].numToDislike[FISH] = 1;
                 break;

      case 'F': /* Fish dislike 3 or more fish and 1 or more cat or bird. */
                 Kritters[NumKritters].type = FISH;
                 Kritters[NumKritters].numToDislike[CAT] = 1;
                 Kritters[NumKritters].numToDislike[BIRD] = 1;
                 Kritters[NumKritters].numToDislike[FISH] = 3;
                 break;

      case 'N': /* No animal in this cage.                                 */
                break;

      default:   /* Found an invalid kritter type, it may just be EOF.     */
                 return;
  }

  /* 
   * Put this kritter in its cage.
   */
  Cages[row][col] = NumKritters++;
}


/***************************************************************************
 * Function:  ReadKritterQuantities
 *
 * Synopsis:  void ReadKritterQuanitities(void)
 *
 * Description:  Read in the quanitities for each type of kritter and use this
 *               info to build each appropriate kritter info object.
 *
 * Return Value:  None.
 ***************************************************************************/
void ReadKritterQuantities()
{
  int  index1, index2, index3;

  /*
   * Initalize all of the kritter info objects.
   */
  for(index1 = 0; index1 < MAX_NUM_KRITTERS; index1++) {
      Kritters[index1].type = -1;
 
      for(index2 = 0; index2 < NUM_KRITTER_TYPES; index2++) {
          Kritters[index1].numToDislike[index2] = -1;
          Kritters[index1].numNear[index2] = 0;
      }
  }

  NumKritters = 0;

  /*
   * Initialize all of the cages.
   */
  for(index1 = 0; index1 < 3; index1++) {
      for(index2 = 0; index2 < 3; index2++) {
          Cages[index1][index2] = -1;
      }
  }

  /* 
   * Read in the quanities for each type of kritter.
   */
  for(index1 = 0; index1 < 3; index1++) {
      for(index2 = 0; index2 < 3; index2++) {
          char kritterType = '\0';

          fscanf(inputFile, "%c", &kritterType);

          if(kritterType == ' ' || kritterType == '\n') {
              index2--;
              continue;
          } else { 
              AddKritters(index1, index2, kritterType);
          }
      }
  }
}


/***************************************************************************
 * Function:  SafeCage
 *
 * Synopsis:  int SafeCage(int row,     [IN] Row of cage we are trying to put kritter in.
 *                         int col)     [IN] Col of cage we are trying to put kritter in.
 *
 * Description:  Determine if the kritter in this cage (if any) is next to any 
 *               kritters that will cause it to fight with, be eaten by, or 
 *               eat a neighboring kritter.
 *
 * Return Value:  TRUE if the kritter in this cage will not fight, be eaten,
 *                or eat a neighboring kritter, FALSE otherwise.
 ***************************************************************************/
int SafeCage(int cageRow, int cageCol)
{
  int             leftType         = -1,
                  rightType        = -1,
                  aboveType        = -1,
                  belowType        = -1,
                  index;
  int             numTypesFound[NUM_KRITTER_TYPES];
  kritterInfo_t  *thisKritter;

  /* 
   * Initialize the array that holds the number of types found.
   */
  for(index = 0; index < NUM_KRITTER_TYPES; index++) {
      numTypesFound[index] = 0;
  }

  /*
   * IF this cage is not occupied, return TRUE, if it is, point
   * to the kritter in that cage.
   */
  if(Cages[cageRow][cageCol] == -1) {
      return TRUE; 
  } else {
      thisKritter = &(Kritters[Cages[cageRow][cageCol]]);
  }

  /* 
   * Determine if kritter to the left of this cage is a problem.
   */
  if(cageCol != 0 && Cages[cageRow][cageCol-1] != -1
          && Kritters[Cages[cageRow][cageCol-1]].type != -1) {
      leftType = Kritters[Cages[cageRow][cageCol-1]].type;
      numTypesFound[leftType]++;
      thisKritter->numNear[leftType]++;
  }

  /* 
   * Determine if the kritter above this cage is a problem.
   */
  if(cageRow != 0 && Cages[cageRow-1][cageCol] != -1
          && Kritters[Cages[cageRow-1][cageCol]].type != -1) {
      aboveType = Kritters[Cages[cageRow-1][cageCol]].type;
      numTypesFound[aboveType]++;
      thisKritter->numNear[aboveType]++;
  }

  /* 
   * Determine if the kritter to the right of this cage is a problem.
   */
  if(cageCol < 2 && Cages[cageRow][cageCol+1] != -1
          && Kritters[Cages[cageRow][cageCol+1]].type != -1) {
      rightType = Kritters[Cages[cageRow][cageCol+1]].type;
      numTypesFound[rightType]++;
      thisKritter->numNear[rightType]++;
  }

  /* 
   * Determine if the kritter below this cage is a problem.
   */
  if(cageRow < 2 && Cages[cageRow+1][cageCol] != -1
          && Kritters[Cages[cageRow+1][cageCol]].type != -1) {
      belowType = Kritters[Cages[cageRow+1][cageCol]].type;
      numTypesFound[belowType]++;
      thisKritter->numNear[belowType]++;
  }

  /*
   * Determine if there are a safe number of each type of kritter near this cage.
   */
  for(index = 0; index < NUM_KRITTER_TYPES; index++) {
      if(thisKritter->numToDislike[index] == -1) {
          continue;
      }

      /* 
       * If there is an unsafe amount of this type of kritter near this kritter,
       * return FALSE.
       */
      if(thisKritter->numToDislike[index] <= thisKritter->numNear[index]) {
         return FALSE;
      }
  }

  /*
   * If we've gotten here, then this kritter must be safe, so return TRUE.
   */
  return TRUE;
}


/***************************************************************************
 * Function:  KrittersAreSafe 
 *
 * Synopsis:  int KrittersAreSafe(void) 
 *
 * Description:   Determine whether the current placement of all of the
 *                kritters will result in fighting or eatten kritters. 
 *
 * Return Value:  TRUE if all kritters are in a safe cage, FALSE otherwise.
 *
 ***************************************************************************/
KrittersAreSafe() {
  int cageRow, cageCol;

  /* 
   * For every kritter in every cage... 
   */
  for(cageRow = 0; cageRow < 3; cageRow++ ) {
      for(cageCol = 0; cageCol < 3; cageCol++) {
          /*
           * IF if the kritter in this cage is not safe, return FALSE. 
           */
          if(!SafeCage(cageRow, cageCol)) {
              return FALSE;
          }
      }
  }

  /*
   * IF we got here, all of the kritters were safe, so return TRUE.
   */
  return TRUE;
}


/***************************************************************************
* Function:  main
*
* Synopsis:  main(void)
*
* Description:  Main driver of the program.  Consists of a loop that
*               through each iteration:
* 		    1.  Reads in the kritter quanities.
*	            2.  Calls PutInCage() to start putting kritters in
*                       appropriate cages and prints whether or not it's
*                       possible to keep all kritters happy.
*		    3.  If another quantity list exists, continue.
*		    4.  If another quantity list does not exist,
*              	        break out of the loop and exit.
*
* Return Value:  Exit 0 if success, exit 1 if error was encountered.
***************************************************************************/
int main()
{
  int index1, index2;

  /* 
   * Attempt to open the input file, return 1 if an error occurs.
   */
  if((inputFile = fopen("kritters.dat", "r")) == NULL) {
      printf("Error, failed to open input file 'kritters.dat'!\n");
      return 1;
  }
 
  /* 
   * Attempt to read in the first set of kritter quanities from input.
   */
  ReadKritterQuantities();

  /* 
   * WHILE we have kritter quantities, print whether all the kritters are 
   * safe or not given their cage assignments.
   */
  while(NumKritters != 0) {
      if(KrittersAreSafe()) {
          printf("GROK HAPPY\n");
      } else {
          printf("GROK SAD\n");
      }

      /* 
       * Attempt to read in another set of kritter quantities from input.
       */
      ReadKritterQuantities();
  } 

  return 0;
}
