/**********************************
 ** File:       spacecamp.cpp	 **
 ** Programmer: Marc Douet       **
 ** Date:       04/10/03         **
 **********************************/

#include <stdio.h>
#include <string.h>

#define  NUM_ROOMS  5
#define  NUM_DOORS  4


/**********************
 ** Global Variables **
 **********************/

char   DoorStates[NUM_ROOMS];
char   ButtonAffectors[NUM_DOORS][NUM_ROOMS];
FILE  *inputFile = NULL;


/***************************************************************************
 * Function:  ReadRoomData
 *
 * Synopsis:  void ReadRoomData(void)
 *
 * Description:  Read in the data about each room including the initial states
 *               of each door and how each button affects each door.
 *
 * Return Value: TRUE if data was successfully read, FALSE otherwise.
 *
 ***************************************************************************/
void ReadRoomData()
{
  int rooms, doors;

  /* 
   * Initialize the state of each door to closed.
   */
  for(rooms = 0; rooms < NUM_ROOMS; rooms++) {
      DoorStates[rooms] = 'C';
  }

  /* 
   * Initialize how each button affects each door to close.
   */
  for(doors = 0; doors < NUM_DOORS; doors++) {
      for(rooms = 0; rooms < NUM_ROOMS; rooms++) {
          ButtonAffectors[doors][rooms] = 'C';
      }
  }

  /*
   * Read in the initial states of all the doors.
   */
  for(rooms = 0; rooms < NUM_ROOMS; rooms++) {
      fscanf(inputFile, "%s", &DoorStates[rooms]);
  }

  /*
   * Read in all of the button affectors for all the doors.
   */
  for(doors = 0; doors < NUM_DOORS; doors++) {
      for(rooms = 0; rooms < NUM_ROOMS; rooms++) {
          fscanf(inputFile, "%s", &ButtonAffectors[doors][rooms]);
      }
  }
}


/***************************************************************************
 * Function:  SuckedIntoSpace
 *
 * Synopsis:  void SuckedIntoSpace(int door)  [IN]  The door behind us.
 *
 * Description:  Determines if we will be sucked into space.  This will happen
 *               only if ALL of the doors behind us are open.
 *
 * Return Value: TRUE if ALL doors behind us are open, FALSE otherwise.
 *
 ***************************************************************************/
int SuckedIntoSpace(int currDoor)
{
  int door;

  /* 
   * Look at all doors behind us, if one of them is closed, we're safe, so return FALSE.
   */
  for(door = currDoor; door >= 0; door--) {
      if(DoorStates[door] == 'C') {
          return FALSE;
      }
  }

  /* 
   * If we made it here, all of the doors behind us are open, so we're history, so 
   * return TRUE.
   */
  return TRUE;
}


/***************************************************************************
 * Function:  PushButton
 *
 * Synopsis:  void PushButton(int button)  [IN]  The button we are pressing.
 *
 * Description:  Simulates the pushing the button of the door passed in, which will
 *               use that door's ButtonAffector table to see how each door's state
 *               should be affected.
 *
 * Return Value: None.
 *
 ***************************************************************************/
void PushButton(int button)
{
  int room;

  for(room = 0; room < NUM_ROOMS; room++) {
      switch(ButtonAffectors[button][room]) {
          case 'O':    DoorStates[room] = 'O';
                       break;

          case 'C':    DoorStates[room] = 'C';
                       break;
 
          case 'T':    if(DoorStates[room] == 'O') {
                           DoorStates[room] = 'C'; 
                       } else {
                           DoorStates[room] = 'O';
                       }
                       break;

          case 'N':    break;

          default:     printf("Error, %c is not a valid button affector!\n", 
                               ButtonAffectors[button][room]);
                       break;
      }
  }
}


/***************************************************************************
 * Function:  TraverseRooms
 *
 * Synopsis:  void TraverseRooms(void)
 *
 * Description:  Starting from the first room, start pressing buttons on each
 *               of the doors in an attempt to try to make it to the final room.
 *               Each time a button is pressed, each door will be affected according
 *               to each of its values in the 'ButtonAffectors' array.
 *
 * Return Value: None.
 *
 ***************************************************************************/
void TraverseRooms()
{
  int rooms;

  /* 
   * For every room, push the button and try to make it in the next room until you 
   * make it to the final room (room 5).  Note we start from the second door since
   * we start inside room 1 and are trying to get to room 2 initially.
   */
  for(rooms = 1; rooms < NUM_ROOMS; rooms++) {
    /* 
     * If this door is already open, proceed to the next room.
     */
    if(DoorStates[rooms] == 'O') {
        continue;
    }

    /*
     * Push this room's button to try to get the door to open.
     */
    PushButton(rooms-1);

    /* 
     * If we were sucked out into space print our status and return.
     */
    if(SuckedIntoSpace(rooms-1)) {
        printf("SPACE GHOST\n");
        return;
    }

    /*
     * If this door is still closed after pressing the button, we're stuck so print 
     * our status and return.
     */
    if(DoorStates[rooms] == 'C') {
        printf("SPACE MONKEY\n");
        return;
    }
  }

  /* 
   * If we got here, then we sucessfully made it to the final room, so print our
   * status and return.
   */
  printf("SPACE CADET\n");
  return;
}


/***************************************************************************
* Function:  main
*
* Synopsis:  main(void)
*
* Description:  Main driver of the program.  Consists of a loop that
*               through each iteration:
*                   1.  Reads in the data for all of the rooms and doors.
*                   2.  Calls TraverseRoom() to attempt to make it to the 
*                       final room and prints the result.
*                   3.  If more data exists, continue.
*                   4.  If more data does not exist,
*                       break out of the loop and exit.
*
* Return Value:  Exit 0 if success, exit 1 if error was encountered.
***************************************************************************/
int main()
{
  char tag[sizeof("START")];

  /* 
   * Attempt to open the input file, exit with 1 if an error occurs.
   */
  if((inputFile = fopen("spacecamp.dat", "r")) == NULL) {
      printf("Error, failed to open input file 'spacecamp.dat'!\n");
      exit(1);
  }

  /*
   * Read in the START tag.
   */
  fscanf(inputFile, "%s", tag);

  /* 
   * WHILE we have found another START tag...
   */
  while(!strcmp(tag, "START")) {
      /* 
       * Read in the room data.
       */
      ReadRoomData();

      /* 
       * Read in the END tag.
       */
      sprintf(tag, "%s", "\0");
      fscanf(inputFile, "%s", tag);
   
      /* 
       * If no END tag was found, the data set is invalid, so print and return an error.
       */
      if(strcmp(tag, "END")) {
          printf("Error, no END tag was found after the data!\n");
          return 1;
      }

      /* 
       * Attempt to traverse all the rooms, printing the result.
       */
      TraverseRooms();

     /* 
      * Attempt to read in another START tag.
      */
     sprintf(tag, "%s", "\0");
     fscanf(inputFile, "%s", tag);
  }
  
  return 0;
}
