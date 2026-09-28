/**********************************
 ** File:       findut.c	   **
 ** Programmer: Marc Douet       **
 ** Date:       12/14/02         **
 **********************************/

#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <malloc.h>
#include <string.h>

#define MAX_LINES		10	/* Max number of lines of data.	*/
#define MAX_CITIES	10	/* Max number of cities.		*/
#define NAME_LENGTH	21	/* Max length of a city name.		*/
#define TRUE		1	/* Macro for boolean true.		*/
#define FALSE		0	/* Macro for boolean false.		*/


/********************************************************************
 ** Connection information that connects two cities together.	 **
 ********************************************************************/

typedef struct connectionInfo {
	char	city[NAME_LENGTH];/* Name of the connecting city.	*/
	int	distance;	/* The distance between the 2 cities.	*/
} connectionInfo_t;


/********************************************************************
 ** Info about each city, and which cities it connects to.	   	 **
 ********************************************************************/

typedef struct city {
	int			numConnections;
	char			name[NAME_LENGTH];	/* Name of this city.		*/
	connectionInfo_t	connectsTo[MAX_CITIES];	/* List of connected cities.	*/
} city_t;


/*************************************************************
 ** Info about each path from the origin to the destination **
 *************************************************************/
typedef struct path {
	int	distanceList[MAX_CITIES];	/* List of distances between cities.	*/
	int	bestDistanceList[MAX_CITIES];	/* List of shortest distances to cities.	*/
	char	cityList[MAX_CITIES][NAME_LENGTH];/* List of cities on this path.		*/
	int	numCities;				/* Number of cities on this path.		*/
	int	isValid;				/* Does this path lead to destination?	*/
} path_t;


/**********************
 ** Global Variables **
 **********************/

char 		*tag;				/* String to hold the START/END tag.*/
char		*origin;			/* Town we are starting from.		*/
char		*destination;		/* Town we are traveling to.		*/
int	 	numLines;			/* Number of lines of input.		*/
int	 	numCities;			/* Number of cities on the map.	*/
int	 	shortestPathDistance;	/* Distance of the shortest path.	*/
int	 	numPaths;			/* Number of paths found so far.	*/
city_t	cities[MAX_CITIES];	/* List of cities on the map.		*/
path_t	pathList[MAX_CITIES];	/* List of paths found so far.	*/



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
    	/* If memory is allocated for the START/END tag, free it.	*/
	if(tag != NULL)
		free(tag);

	/* If memory is allocated for the origin city, free it.	*/
	if(origin != NULL)
		free(origin);

	/* If memory is allocated for the destination city, free it.*/
	if(destination != NULL)
		free(destination);

	/* There's no turning back now, so let's exit 1. 		*/
	exit(1);
}



/***************************************************************************
 * Function:  initCities
 *
 * Synopsis:  void initCities(void)
 *
 * Description:  Initialize the city and path data structures.
 *
 * Return Value:  None.
 ***************************************************************************/
void initCities()
{
	int index, index2, index3, index4;

	for(index = 0; index < MAX_CITIES; index++) {
		for(index2 = 0; index2 < NAME_LENGTH; index2++) {
			cities[index].name[index2] = '\0';
		}

		for(index2 = 0; index2 < MAX_CITIES; index2++) {
			for(index3 = 0; index3 < MAX_CITIES; index3++) {
				cities[index].connectsTo[index2].city[index3] = '\0';
			}

			cities[index].connectsTo[index2].distance = 0;
		}

		for(index2 = 0; index2 < MAX_CITIES; index2++) {
			for(index3 = 0; index3 < MAX_CITIES; index3++) {
				pathList[index2].distanceList[index3] = 0;
				pathList[index2].bestDistanceList[index3] = 0;

				for(index4 = 0; index4 < NAME_LENGTH; index4++) {
					pathList[index2].cityList[index3][index4] = '\0';
				}
			}

			pathList[index2].numCities = 0;
			pathList[index2].isValid = FALSE;
		}


		cities[index].numConnections = 0;
	}

	shortestPathDistance = 0;
	numPaths = 0;
}


/***************************************************************************
 * Function:  printCities
 *
 * Synopsis:  void printCities(void)
 *
 * Description:  Prints a dump of the city and path data structures. 
 *               USED FOR DEBUGGING PURPOSES ONLY. 
 *
 * Return Value:  None.
 ***************************************************************************/
void printCities()
{
	int	index, index2;

	for(index = 0; index < numCities; index++) {
		printf("City %d:\n", index);

		printf("Name: %s\n", cities[index].name);

		for(index2 = 0; index2 < cities[index].numConnections; index2++) {
			printf("Connected City %d: %s, Distance = %d\n", index2
				,cities[index].connectsTo[index2].city
				,cities[index].connectsTo[index2].distance);
		}
		printf("\n");
	}

	printf("There are %d paths\n", numPaths);

	for(index = 0; index <= numPaths-1; index++) {
		printf("Path %d ", index);
		if(pathList[index].isValid) {
			printf("Is Valid\n");
		}

		else {
			printf("Is Not Valid\n");
		}

		for(index2 = 0; index2 < pathList[index].numCities; index2++) {
			printf("City %d: %s, distance = %d, BestDistance = %d\n", index2,
				pathList[index].cityList[index2],
				pathList[index].distanceList[index2], 
				pathList[index].bestDistanceList[index2]);
		}
	}
}


 /***************************************************************************
  * Function:  getCity
  *
  * Synopsis:  city_t getCity(char *city)
  *
  *		*city	[IN]	Name of the city to get.
  *
  * Description:  Returns the city info of the city passed in.
  *
  * Return Value:  City info of the city we are looking for.
  ***************************************************************************/
city_t getCity(char *city)
{
	int index;

	for(index = 0; index < numCities; index++) {
		if(!strcmp(cities[index].name, city)) {
			return cities[index];
		}
	}

	printf("Failure on lookup of city %s\n", city);
	HandleError();

	return cities[index];	/* Never reached, added to avoid compiler warnings. */
}


/***************************************************************************
 * Function:  copyPath
 *
 * Synopsis:  void copyPath(path_t oldPath, char *lastCity)
 *
 *		 oldPath	[IN]	The path to copy from.
 *		*lastCity	[IN]	The name of the last city to copy in the path.
 *
 * Description:  Copies the 'oldPath' to the current path starting from the first
 *		     city to 'lastCity'.
 *
 * Return Value:  None.
 ***************************************************************************/
void copyPath(path_t oldPath, char *lastCity)
{
	int index;
	int	lastCityIndex = -1;

	for(index = 0; index < oldPath.numCities; index++) {
		if(!strcmp(lastCity, oldPath.cityList[index])) {
			lastCityIndex = index;
			break;
		}
	}

	if(!oldPath.isValid) {
		pathList[numPaths].numCities--;
	}

	else if(lastCityIndex != -1) {
		for(index = 0; index <= lastCityIndex; index++) {
			sprintf(pathList[numPaths].cityList[pathList[numPaths].numCities], "%s",
				oldPath.cityList[index]);
			pathList[numPaths].distanceList[index] = oldPath.distanceList[index];
			pathList[numPaths].bestDistanceList[index] = 
				oldPath.bestDistanceList[index];
			pathList[numPaths].numCities++;
		}
	}
}


/***************************************************************************
 * Function:  getPathDistance 
 *
 * Synopsis:  int getPathDistance()
 *
 * Description:  Determines the total distance of the current path.
 *
 * Return Value:  Distance from the origin to the last city along this path. 
 ***************************************************************************/  
int getPathDistance()
{
	int index;
	int totalDistance = 0;
	path_t thisPath = pathList[numPaths];

	for(index = 0; index < thisPath.numCities; index++) {
		totalDistance += thisPath.distanceList[index];
	}

	return totalDistance;
}


/***************************************************************************
 * Function:  bestDistanceSoFar
 *
 * Synopsis:  int bestDistanceSoFar(char* thisCity, int thisDistance)
 *
 *               *thisCity       	[IN]    The city we want the best distance for.
 *               *thisDistance	[IN]    The distance we are comparing the best 
 *                                       	  distance to.
 *
 * Description:  Determines whether 'thisDistance' is less than the best distance
 *               seen so far for 'thisCity'. 
 *
 * Return Value:  TRUE if 'thisDistance' < the best distance for 'thisCity',
 * 		      FALSE otherwise. 
 ***************************************************************************/  
int bestDistanceSoFar(char *thisCity, int thisDistance)
{
	int index1, index2;
	int bestDistance = thisDistance;

	for(index1 = 0; index1 < numPaths; index1++) {
		for(index2 = 0; index2 < numCities; index2++) {
			if(!strcmp(pathList[index1].cityList[index2], thisCity)) {
				if(thisDistance < pathList[index1].bestDistanceList[index2]) {
					bestDistance = thisDistance;
				}

				else	bestDistance = pathList[index1].bestDistanceList[index2];
			}
		}
	}

	if(bestDistance == thisDistance) {
		return TRUE;
	}

	else	return FALSE;
}


/***************************************************************************
 * Function:  findShortestPath
 *
 * Synopsis:  int findShortestPath(city_t thisCity, city_t originCity)
 *
 *		thisCity	[IN]	The city we currently in.
 *		originCity	[IN]	The city we are coming from.
 *
 * Description:  Recursively traverses through all of the cities between
 *		     'origin' to 'destination', creating path info for every
 *		     possible path, with are used by printShortestPath to print
 *		     the shortest path.
 *
 * Return Value:  TRUE if the 'destination' was reached, FALSE otherwise.
 ***************************************************************************/
int findShortestPath(city_t thisCity, city_t originCity)
{
	int		index;
	int		returnedFromCity = FALSE;
	static int	foundValidPath = FALSE;

	for(index = 0; index < thisCity.numConnections; index++) {
		if(!strcmp(originCity.name, thisCity.connectsTo[index].city)
				|| !strcmp(thisCity.connectsTo[index].city, origin)) {
			continue;
		}

		if(numPaths > 0 && (returnedFromCity || foundValidPath)) {
			if(foundValidPath) {
				copyPath(pathList[numPaths-1], thisCity.name);
			}

			else	copyPath(pathList[numPaths], thisCity.name);

			returnedFromCity = FALSE;
			foundValidPath = FALSE;
		}


		if(!strcmp(destination, thisCity.connectsTo[index].city)) {
			pathList[numPaths].isValid = TRUE;
                	sprintf(pathList[numPaths].cityList[pathList[numPaths].numCities],
				"%s", thisCity.connectsTo[index].city);
                	pathList[numPaths].distanceList[pathList[numPaths].numCities] =
				thisCity.connectsTo[index].distance;
                	pathList[numPaths].numCities++;
			numPaths++;
			foundValidPath = TRUE;
			continue;
		}

		else if(bestDistanceSoFar(thisCity.connectsTo[index].city,
				(getPathDistance()+thisCity.connectsTo[index].distance))) {
			sprintf(pathList[numPaths].cityList[pathList[numPaths].numCities],
				"%s", thisCity.connectsTo[index].city);
			pathList[numPaths].distanceList[pathList[numPaths].numCities] =
				thisCity.connectsTo[index].distance;
			pathList[numPaths].bestDistanceList[pathList[numPaths].numCities] =
				(getPathDistance()+thisCity.connectsTo[index].distance);
			pathList[numPaths].numCities++;
			returnedFromCity = 
				findShortestPath(getCity(thisCity.connectsTo[index].city),
				getCity(thisCity.name));
		}
	}

	return foundValidPath;
}


/***************************************************************************
 * Function:  printShortestPath
 *
 * Synopsis:  void printShortestPath(void)
 *
 * Description:  Uses all path info created by findShortestPath() to determine
 *	           which path is the shortest, and print it.
 *
 * Return Value:  None.
 ***************************************************************************/
void printShortestPath()
{
	int		index, index2;
	int		currDistance = 0;
	int		bestPathIndex = 0;
	int		shortestDistance = 100000;

	for(index = 0; index <= numPaths-1; index++) {
		for(index2 = 0; index2 < pathList[index].numCities; index2++) {
			currDistance += pathList[index].distanceList[index2];
		}

		if((currDistance < shortestDistance)
				&& (pathList[index].isValid)){
			shortestDistance = currDistance;
			bestPathIndex = index;
		}

		currDistance = 0;
	}

	printf("DATASET %d\n", numLines);
	printf("%s ", origin);

	for(index = 0; index <= pathList[bestPathIndex].numCities-2; index++) {
		printf("%s ", pathList[bestPathIndex].cityList[index]);
	}

	printf("%s %d\n", destination, shortestDistance);
}


/***************************************************************************
 * Function:  main
 *
 * Synopsis:  main(void)
 *
 * Description:  Main driver of the program.  Consists of a loop that
 *               through each iteration:
 * 			1.  Reads in a list of cities and destances between them.
 *			2.  Creates a list of path info for each possible path.
 *			3.  Prints the shortest path using the list of path info
 *			5.  If another "DATASET" string exists, continue.
 *			6.  If another "DATASET" string does not exist,
 *              	    break out of the loop and exit.
 *
 * Return Value:  None.
 ***************************************************************************/
main()
{
	int	index, index2, index3;
	char	tempName[NAME_LENGTH];

	/* Try to allocate memory to hold the START/END	tag using the 	*/
    	/* size of the bigger tag (START).						*/
	if((tag = (char*)malloc(sizeof("DATASET"))) == NULL) {
		printf("Error: Unable to malloc %d bytes for START/END tag.\n",
			sizeof("START"));
		HandleError();
	}

	/* Try to allocate memory to hold the origin city.			*/
	if((origin = (char*)malloc(NAME_LENGTH)) == NULL) {
		printf("Error: Unable to malloc %d bytes for origin.\n",
			NAME_LENGTH);
		HandleError();
	}

	/* Try to allocate memory to hold the destination city.		*/
	if((destination = (char*)malloc(NAME_LENGTH)) == NULL) {
		printf("Error: Unable to malloc %d bytes for destination.\n",
			NAME_LENGTH);
		HandleError();
	}

	/* Read in the START tag and element count.				*/
	scanf("%s", tag);

	/* WHILE we have found a START tag...					*/
	while(!strcmp(tag, "DATASET")) {
		initCities();

		/* Read in the number of lines and cities.			*/
		scanf("%d", &numLines);
		scanf("%d", &numCities);

		for(index = 0; index < numCities; index++)
			scanf("%s", cities[index].name);

		for(index = 0; index < numLines-1; index++) {
			scanf("%s", tempName);

			for(index2 = 0; index2 < numCities; index2++) {
				if(!strcmp(cities[index2].name, tempName)) {
					scanf("%s %d", 
			cities[index2].connectsTo[cities[index2].numConnections].city
			,&cities[index2].connectsTo[cities[index2].numConnections].distance);
					cities[index2].numConnections++;

					for(index3 = 0; index3 < numCities; index3++) {
						if(!strcmp(cities[index2].
						connectsTo[cities[index2].numConnections-1].city,
						cities[index3].name)) {
							sprintf(cities[index3].
						connectsTo[cities[index3].numConnections].city,
						"%s", tempName);
							cities[index3].connectsTo[cities[index3].
						numConnections].distance =
						cities[index2].connectsTo[cities[index2].
						numConnections-1].distance;
							cities[index3].numConnections++;
							break;
						}
					}

					break;
				}
			}

			for(index3 = 0; index3 < NAME_LENGTH; index3++)
				tempName[index3] = '\0';
		}

		origin = cities[0].name;
		destination = cities[1].name;

		findShortestPath(cities[0], cities[0]);
		printShortestPath();

		/* Clear the START/END tag.					*/
		memset((void *)tag, '\0', sizeof("DATASET"));

		/* Try to read in another tag.				*/
		scanf("%s", tag);
		memset((void *)origin, '\0', sizeof(NAME_LENGTH));
		memset((void *)destination, '\0', sizeof(NAME_LENGTH));
	}
}

