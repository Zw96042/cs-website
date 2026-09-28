/**********************************
 ** File:       golf.cpp	 **
 ** Programmer: Marc Douet       **
 ** Date:       04/07/03         **
 **********************************/

#include <stdio.h>
#include <string.h>

#define  MAX_ROW  20
#define  MAX_COL  20             
#define  MIN_PAR  3
#define  MAX_PAR  5


/* 
 * Enumeration for each type of club.
 */
enum clubTypes { PUTTER=1, WEDGE=3, IRON=5, DRIVER=10 } clubTypes_t;

/* 
 * Enumeration for the possible state of a location on the course map.
 */
enum groundStates { TREE=-3, FAREWAY=-2, HOLE=-1, START=0 } groundStates_t;


/**********************
 ** Global Variables **
 **********************/

int    CourseMap[MAX_ROW][MAX_COL];
int    ParScore, MapHeight, MapWidth;
FILE  *inputFile = NULL;


/***************************************************************************
 * Function:  ReadCourseMap
 *
 * Synopsis:  void ReadCourseMap(void)
 *
 * Description:  Read in the values from the course map and build our own 
 *               representation of the course map.
 *
 * Return Value: TRUE if map was successfully read, FALSE otherwise.
 *
 ***************************************************************************/
int ReadCourseMap()
{
  int  courseRow, courseCol;
  char mapPlot;

  /* 
   * Initialize the course map to all fareway.
   */
  for(courseRow = 0; courseRow < MAX_ROW; courseRow++) {
      for(courseCol = 0; courseCol < MAX_COL; courseCol++) {
          CourseMap[courseRow][courseCol] = FAREWAY;
      }
  }

  /* 
   * Initialize the remaining globals.
   */
  ParScore = 0, MapHeight = 0; MapWidth = 0;

  /* 
   * Read in the height/width of the course and the par score for this game.
   */
  fscanf(inputFile, "%d %d %d", &MapWidth, &MapHeight, &ParScore);

  /* 
   * Verify the data set.
   */
  if((MapWidth > MAX_COL || MapWidth < 1) || (MapHeight > MAX_ROW || MapHeight < 1)
          || (ParScore > MAX_PAR || ParScore < MIN_PAR)) {
      return FALSE;
  }

  /* 
   * Read in the course map and plot our map accordingly.
   */
  for(courseRow = 0; courseRow < MapHeight; courseRow++) {
      for(courseCol = 0; courseCol < MapWidth; courseCol++) {
          fscanf(inputFile, "%c", &mapPlot);

          switch(mapPlot) {

              case '*':    CourseMap[courseRow][courseCol] = START;
                           break;
              
              case 'O':    CourseMap[courseRow][courseCol] = HOLE;
                           break;

              case 'T':    CourseMap[courseRow][courseCol] = TREE;
                           break;

              case ' ':    courseCol--;
                           break;

              case '\n':   courseCol--;
                           break;
          }
      }
  }

  return TRUE;                
}


/***************************************************************************
 * Function:  PrintScore 
 *
 * Synopsis:  void PrintScore(int score)   [IN] Total number of strokes.
 *
 * Description:  Print out the players best possible score as follows:
 *
 *                   (score-par)          (Printed Score)
 *                        2               "Double Bogey"
 *                        1               "Bogey"
 *                        0               "Par"
 *                       -1               "Birdie"
 *                       -2               "Eagle"
 *
 * Return Value:  None.
 *
 ***************************************************************************/
void PrintScore(int score)
{
  int row, col;

  switch(score-ParScore) {
      case  2:    printf("Double Bogey\n");
                  break;

      case  1:    printf("Bogey\n");
                  break;

      case  0:    printf("Par\n");
                  break;

      case -1:    printf("Birdie\n");
                  break;

      case -2:    printf("Eagle\n");
                  break;

      default:    printf("Error, %d is not a valid Over Par score!\n", (score-ParScore));
                  printf("Strokes = %d, ParScore = %d\n", score, ParScore);
                  break;
  }
}
  

/***************************************************************************
 * Function:  UseClub 
 *
 * Synopsis:  int UseClub(int row,         [IN] Row we are playing from.
 *                        int col,         [IN] Col we are playing from.
 *                        int currStroke,  [IN] Stroke we are currently on.
 *                        int club)        [IN] Club to use.
 *
 * Description:  Play in every possible direction using the club passed in,
 *               filling in the map to show the plots the ball lands on for
 *               this stroke.  If the ball lands in the HOLE, print the final
 *               score and return TRUE to tell the calling function that we
 *               are done.
 *
 * Return Value:  TRUE if the ball landed in the HOLE, FALSE otherwise.
 *
 ***************************************************************************/
int UseClub(int row, int col, int currStroke, int club)
{
  /*
   * Try to hit the ball to the north using the club.
   */
  if((row-club) >= 0) {
      if(CourseMap[row-club][col] == HOLE) {
          PrintScore(currStroke+1);
          return TRUE;
      }

      if(CourseMap[row-club][col] == FAREWAY
              || CourseMap[row-club][col] == START) {
          CourseMap[row-club][col] = currStroke+1;
      }
  }

  /*
   * Try to hit the ball to the east using the club.
   */
  if((col+club) < MapWidth) {
      if(CourseMap[row][col+club] == HOLE) {
          PrintScore(currStroke+1);
          return TRUE;
      }

      if(CourseMap[row][col+club] == FAREWAY
               || CourseMap[row][col+club] == START) {
          CourseMap[row][col+club] = currStroke+1;
      }
  }

  /*
   * Try to hit the ball to the south using the club.
   */
  if((row+club) < MapHeight) {
      if(CourseMap[row+club][col] == HOLE) {
          PrintScore(currStroke+1);
          return TRUE;
      }

      if(CourseMap[row+club][col] == FAREWAY
              || CourseMap[row+club][col] == START) {
          CourseMap[row+club][col] = currStroke+1;
      }
  }

  /*
   * Try to hit the ball to the west using the club.
   */
  if((col-club) >= 0) {
      if(CourseMap[row][col-club] == HOLE) {
          PrintScore(currStroke+1);
          return TRUE;
      }

      if(CourseMap[row][col-club] == FAREWAY
              || CourseMap[row][col-club] == START) {
          CourseMap[row][col-club] = currStroke+1;
      }
  }

  /*
   * We didn't sink the ball this stroke, so return FALSE.
   */
  return FALSE;
}


/***************************************************************************
 * Function:  PerformStrokes
 *
 * Synopsis:  int PerformStrokes(int row,         [IN] Row we are playing from. 
 *                               int col,         [IN] Col we are playing from.
 *                               int currStroke)  [IN] Stroke we are currently on.
 *
 * Description:  Play in every possible direction using every possible club,
 *               filling in the map to show the plots the ball lands on for
 *               this stroke.  If the ball lands in the HOLE, return TRUE
 *               TRUE to tell the calling function that we are done.
 *
 * Return Value:  TRUE if the ball landed in the HOLE, FALSE otherwise.
 *
 ***************************************************************************/
int PerformStrokes(int row, int col, int currStroke)
{
  /* 
   * Hit the ball using the PUTTER, return TRUE if we sank the ball.
   */
  if(UseClub(row, col, currStroke, PUTTER)) {
      return TRUE;
  }

  /*
   * Hit the ball using the WEDGE, return TRUE if we sank the ball.
   */  
  if(UseClub(row, col, currStroke, WEDGE)) {
      return TRUE;
  }

  /*
   * Hit the ball using the IRON, return TRUE if we sank the ball.
   */
  if(UseClub(row, col, currStroke, IRON)) {
      return TRUE;
  }

  /*
   * Hit the ball using the DRIVER, return TRUE if we sank the ball.
   */
  if(UseClub(row, col, currStroke, DRIVER)) {
      return TRUE;
  }

  /* 
   * We didn't sink the ball this stroke, so return FALSE.
   */
  return FALSE;
}


/***************************************************************************
 * Function:  CalculateScore
 *
 * Synopsis:  void PrintScore(void)
 *
 * Description:  Determine the fewest amount of strokes it will take to sink
 *               the ball and print the result of the game.
 *
 * Return Value:  None.
 *
 ***************************************************************************/
void CalculateScore()
{
  int currStroke, courseRow, courseCol; 

  for(currStroke = START; currStroke < (ParScore+2); currStroke++) {
      for(courseRow = 0; courseRow < MapHeight; courseRow++) {
          for(courseCol = 0; courseCol < MapWidth; courseCol++) {
              if(CourseMap[courseRow][courseCol] != currStroke) {
                  continue;
              }

              if(PerformStrokes(courseRow, courseCol, currStroke)) {
                  return;
              }
          }
      }
  }   
}


/***************************************************************************
* Function:  main
*
* Synopsis:  main(void)
*
* Description:  Main driver of the program.  Consists of a loop that
*               through each iteration:
*                   1.  Reads in the course map.
*                   2.  Calls CalculateScore() to calculate and print the 
*                       final score.
*                   3.  If another map exists, continue.
*                   4.  If another map does not exist,
*              	        break out of the loop and exit.
*
* Return Value:  Exit 0 if success, exit 1 if error was encountered.
***************************************************************************/
int main()
{

  /* 
   * Attempt to open the input file, exit with 1 if an error occurs.
   */
  if((inputFile = fopen("golf.dat", "r")) == NULL) {
      printf("Error, failed to open input file 'golf.dat'!\n");
      return(1);
  }

  /* 
   * WHILE we have a map, print the outcome of the golf game.
   */
  while(ReadCourseMap()) {
      CalculateScore();
  }
  
  return 0;
}
