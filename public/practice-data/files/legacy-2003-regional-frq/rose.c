#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

int
main(void)
{
    FILE *infile;

    /* Open the file */
    infile = fopen("rose.dat","r");
    if (infile == NULL)
    {
        fprintf(stderr,"Error %d opening rose.dat!\n",errno);
        exit(1);
    }

    /* Process the input data sets */
    while (!feof(infile))
    {
        char Line[1000];
        int ThornList[160];
        int ThornsPerSide;
        int TotalThorns;
        int NumScanned, i, j;
        int Ones, Hundredths;
        int SwapOccurred;
        int TempThorn;
        int GapFound;

        /* Try to read the START X line */
        NumScanned = fscanf(infile,"START %d ",&ThornsPerSide);

        /* If we didn't find it, we're done */
        if (NumScanned != 1) break;

        /* Read in the next four lines of thorn locations */
        TotalThorns = 4 * ThornsPerSide;
        for (i = 0; i < TotalThorns; i++)
        {
            fscanf(infile,"%d.%d ",&Ones, &Hundredths);
            ThornList[i] = Ones * 100 + Hundredths;
            /* printf("Scanned %d.%2.2d\n", Ones, Hundredths); */
        }

        /* Sort the thorn locations */
        SwapOccurred = TRUE;
        while (SwapOccurred)
        {
            SwapOccurred = FALSE;
            for (i = 0; i < TotalThorns - 1; i++)
            {
                if (ThornList[i] > ThornList[i+1])
                {
                    SwapOccurred = TRUE;
                    TempThorn = ThornList[i];
                    ThornList[i] = ThornList[i+1];
                    ThornList[i+1] = TempThorn;
                }
            }
        }

        /* Look for a gap of 1.25 or more */
        GapFound = FALSE;
        for (i = 0; i < TotalThorns - 1; i++)
        {
            if ((ThornList[i+1] - ThornList[i]) >= 125)
            {
                GapFound = TRUE;
                printf("Found a gap between %d and %d.\n",
                        ThornList[i], ThornList[i+1]);
                break;
            }
        }
        if ((ThornList[0] >= 125) ||
            (ThornList[TotalThorns - 1] <= 875))
        {
            GapFound = TRUE;
            printf("Found a gap at the top or bottom.\n");
        }

        /* If you found a gap, print the success message */
        if (GapFound)
        {
            printf("A ROSE FOR MY LOVE\n");
        }
        /* Otherwise print the failure message */
        else
        {
            printf("A THORN FOR MY TROUBLES\n");
        }

        /* Read the END line */
        fscanf(infile,"END ");
    }

    /* Exit */
    exit(0);
}
