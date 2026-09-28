#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

int main (void)
{
    FILE *infile;

    /* Open the file */
    infile = fopen("baseball.dat","r");
    if (infile == NULL)
    {
        fprintf(stderr,"Error %d opening baseball.dat!\n",errno);
        exit(1);
    }

    while (!feof(infile))
    {
        char line[PATH_MAX];
        int i;
        int AtBats, Hits;
        long TotalAtBats, TotalHits;
        long BestAtBats, BestHits, BestNumGames;

        /* Read the START line */
        line[0] = '\0';
        fgets(line,PATH_MAX,infile);

        /* If no START line was found, we're done */
        if (strncmp(line,"START",5)) 
        {
/*            printf("Found the EOF\n"); */
            break;
        }

        /* Read the data */
        TotalAtBats = TotalHits = 0;
        BestAtBats = BestHits = 0;
        for (i=1; i<=10; i++)
        {
            fscanf(infile,"%d %d ",&Hits,&AtBats);

            TotalHits += Hits;
            TotalAtBats += AtBats;

/*            printf("%d %d [%d, %d, %f]\n",
                   Hits, AtBats, TotalHits, TotalAtBats, 
                   (double) TotalHits / (double) TotalAtBats);
*/
            /* If we're on the first game, so far it's our best */
            if (i == 1)
            {
                BestHits = TotalHits;
                BestAtBats = TotalAtBats;
                BestNumGames = 1;
            }
            /* Otherwise we have to compare */
            else
            {

                /* This is going to be a bit strange.  I want to compare
                 * the total hits/atbats ratio to the current best ratio
                 * without using floating point numbers (just cause I'm 
                 * weird).  So we're interested in the result of the
                 * following comparison: 
                 *
                 *          (TH / TA) >= (BH / BA)
                 *
                 * But by multiplying the left side by (BA/BA) and the
                 * right by (TA/TA), which is fine because they both equal
                 * one, we get:
                 *
                 *  ((TH * BA) / (TA * BA)) >= ((BH * TA) / (TA * BA))
                 *
                 * Now note that both ratios have the same denominator, so
                 * we can eliminate it to get:
                 *
                 *          (TH * BA) >= (BH * TA)
                 *
                 * Which is great because it just involves integers. 
                 */

                if ((TotalHits * BestAtBats) >= (BestHits * TotalAtBats))
                {
                    BestHits = TotalHits;
                    BestAtBats = TotalAtBats;
                    BestNumGames = i;
                }
            }
        }

        /* Print the results */

        /* Treat 1.000 as a special case. */
        if (BestHits == BestAtBats)
        {
            printf("BATTING 1.000 FOR LAST %d GAME(S)\n", BestNumGames);
        }
        /* This should be more common. */
        else
        {
            double AverageDouble;
            long AverageInt;

            AverageDouble = (double) BestHits / (double) BestAtBats;
            AverageDouble *= (double) 1000;
            AverageInt = (long) AverageDouble;

            /* Since a cast to an integer type truncates the floating
             * point number, we now have to check to see if we need
             * to round up. */
            if (AverageDouble - AverageInt >= 0.5)
            {
                AverageInt++;
            }

            printf("BATTING .%3.3d FOR LAST %d GAME(S)\n", 
                             AverageInt,  BestNumGames);
        }

        /* Read the END line */
        fgets(line,PATH_MAX,infile);
    }

    exit(0);
}
