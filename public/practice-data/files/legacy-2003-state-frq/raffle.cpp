#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

/* #define DEBUG */
#define MAX_PRIZES 10
#define MAX_CONTESTANTS 10
#define MAX_LINE 80
#define NO_PREFERENCE 0

int prize_matrix[MAX_CONTESTANTS][MAX_PRIZES];
char prize_list[MAX_PRIZES][MAX_LINE];
char contestant_list[MAX_CONTESTANTS][MAX_LINE];

int PrizeIndex(char *prize);
int ContestantIndex(char *contestant);

int
main(void)
{
   FILE *infile;
   int raffle;
   char end[MAX_LINE];

   /* Open the input file */
   infile = fopen("raffle.dat","r");

   for (raffle = 1; ;raffle++)
   {
      int args_read;
      int num_contestants, num_prizes;

      /* Initialize the prize matrix and list for the next raffle */
      memset(prize_matrix,0,sizeof(prize_matrix));
      memset(prize_list,0,sizeof(prize_list));
      memset(contestant_list,0,sizeof(contestant_list));

      /* read the START line */
      args_read = fscanf(infile,
                         "START %d %d ",
                         &num_contestants,
                         &num_prizes);

      /* if there was no START line, we're done */
      if (args_read != 2) break;

      /***********************/
      /* read the input data */
      /***********************/
      
      /* read the prize list */
      for (int i=0; i<num_prizes; i++)
      {
         fgets(prize_list[i],MAX_LINE,infile);
         prize_list[i][strlen(prize_list[i])-1] = '\0';
      }

      /* read the contestant info */
      for (int contestant = 0; contestant < num_contestants; contestant++)
      {
         /* read the contestant name */
         fgets(contestant_list[contestant],MAX_LINE,infile);
         contestant_list[contestant][strlen(contestant_list[contestant])-1] = '\0';

         /* read this contestant's preference list */
         for (int preference = 1; preference < (num_prizes+1); preference++)
         {
            char prize[MAX_LINE];
            fgets(prize,MAX_LINE,infile);
            prize[strlen(prize)-1] = '\0';

            /* Put this prize preference in the prize matrix */
            prize_matrix[contestant][PrizeIndex(prize)]=preference; 
         }
      }

      /* Print the banner for this raffle */
      fprintf(stdout,"Raffle #%d:\n",raffle);

      /* Simulate the raffle as we read the drawing order */
      for (int i=0; i<num_contestants; i++)
      {
         char contestant[MAX_LINE];
         int favorite_prize = 9999;
         int favorite_prize_value = 9999;

         /* read the next name drawn */
         fgets(contestant,MAX_LINE,infile);
         contestant[strlen(contestant)-1] = '\0';

         /* what prize does this person want most? */
         for (int prize=0; prize<num_prizes; prize++)
         {
            if ((prize_matrix[ContestantIndex(contestant)][prize] != 0) &&
                (prize_matrix[ContestantIndex(contestant)][prize] 
                                                      < favorite_prize_value))
            {
               favorite_prize = prize;
               favorite_prize_value = prize_matrix[ContestantIndex(contestant)][prize];
            }
         }

         /* if there's nothing left for this guy, skip him! */
         /* (this should never happen, but you never know...) */ 
         if (favorite_prize == 9999) continue; 

         /****************************/
         /* Award this guy his prize */
         /****************************/

         /* Display his winnings */
         fprintf(stdout,"%s Wins %s!!\n",
                       contestant,
                       prize_list[favorite_prize]);

         /* Remove the prize from the pool */
         for (int k=0; k < num_contestants; k++)
         {
            prize_matrix[k][favorite_prize] = 0;
         }

      }/* End of this raffle */

      /* read the END line */
      fgets(end,MAX_LINE,infile);
      if (strncmp("END",end,3)) 
      {
         fprintf(stderr,"Found \"%s\" looking for END!\n",end);
         exit(EINVAL);
      }

   }/* End of input reached */

   return 0;
}

int
PrizeIndex(char *prize)
{
   for (int i=0; i < MAX_PRIZES; i++)
   {
      if (!strcmp(prize,prize_list[i]))
         return i;
   }

   /* if we get here, this isn't a valid prize */
   return -1;
}

int
ContestantIndex(char *contestant)
{
   for (int i=0; i < MAX_CONTESTANTS; i++)
   {
      if (!strcmp(contestant,contestant_list[i]))
         return i;
   }

   /* Should never get here, print an error */
   fprintf(stderr,"Error indexing contestant \"%s\"!\n",contestant);
   exit(EINVAL);

   return 0;
}
