#include <stdlib.h>
#include <stdio.h>
#include <errno.h>
#include <string.h>
#include <math.h>

#define MAX_LINE 80

int mypow(int base, int exp);

int
main (void)
{
   FILE *infile;

   /* open the input data file */
   infile = fopen("decrypt.dat","r");

   /* process the data sets */
   while (1)
   {
      int args_read;
      int num_encoded_bytes;

      /* read the next start line */
      args_read = fscanf(infile," MESSAGE %d",&num_encoded_bytes);

      /* if there wasn't one, we're done */
      if (args_read != 1) break;

      /* echo the start line */
      printf("MESSAGE %d\n",num_encoded_bytes);
     
      /* process the message */
      for (int curline=0; curline<((num_encoded_bytes-1)/8+1); curline++)
      {
         char line[MAX_LINE+1];

         /* read the next line of the message */
         fscanf(infile,"%s",line);

         /* print the output */
         for (int curbyte=0; curbyte < (strlen(line)/8); curbyte++)
         {
            char bytevalue=0;

            /* calculate the next byte */
            for (int curbit=0; curbit < 8; curbit++)
            {
               bytevalue+=mypow(2,7-curbit)*(line[(curbyte*8)+curbit]-'0');
            }

            /* print the next byte */
            printf("%c",bytevalue);
         }
      }
      
      /* End the output line */
      puts("");
   }

   /* return */
   return 0;
}

// subroutine: mypow
//
// This routine was created as an alternative to the regular pow() routine
// since we want to deal only with integer values. 
int
mypow(int base, int exp)
{
   int val = 1;
   for (int i=0; i<exp; i++)
   {
      val*=base;
   } 
   return val;
}
