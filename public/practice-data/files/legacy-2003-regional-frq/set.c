#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

int Member[9];
int NumProgrammers;
int MaxProductivity[3];
int MaxProductivityTotal;
int PMatrix[9][9];

void DetermineBestCombination (int);

int main (void)
{
    FILE *infile;

    /* Open the input data file */
    infile = fopen("set.dat","r");
    if (infile == NULL)
    {
        fprintf(stderr,"Error %d opening set.dat!\n",errno);
        exit(1);
    }

    while (!feof(infile))
    {
        int NumScanned;
        int i, j, temp;
     
        /* Read the START line */
        NumScanned = fscanf(infile,"START %d ", &NumProgrammers);

        /* If we didn't get a proper START line, we're done */
        if (NumScanned != 1) break;

        /* Initialize the current team to nothing. */
        for (i = 0; i < 9; i++)
        {
            Member[i]=FALSE;
        }

        /* Read in the current team's profile matrix */
        for (i=0; i<NumProgrammers; i++)
        {
            for (j=0; j<NumProgrammers; j++)
            {
                fscanf(infile,"%d ",&PMatrix[i][j]);
            }
        }

        /* Initialize the starting max to an impossibly small value */
        MaxProductivityTotal = -4501;

        /* Determine the best combination */
        DetermineBestCombination(0);

        /* Display the winning values */
        printf("%d %d %d %d\n",
               MaxProductivity[0] + 1,
               MaxProductivity[1] + 1,
               MaxProductivity[2] + 1,
               MaxProductivityTotal);

        /* Skip past the END line */
        NumScanned = fscanf(infile,"END ");
    }
}

void
DetermineBestCombination (int ProgrammersChosen)
{
    /*
     * If we don't have a full team, check all possible teams with
     * the members we currently have.
     */
    if (ProgrammersChosen < 3)
    {
        int i;

        /* For each programmer */
        for (i=0; i<NumProgrammers; i++)
        {
            /* If this programmer is already chosen, skip him */
            if (Member[i] == TRUE) continue;

            /* Choose this programmer */
            Member[i] = TRUE;

            /* Determine the best combination */
            DetermineBestCombination(ProgrammersChosen+1);

            /* Un-choose this programmer */
            Member[i] = FALSE;
        }
    }
    else /* Our team is full, check it against the best */
    {
        int i, x;
        int MemberIndex[3];
        int Productivity[3];
        int ProductivityTotal;

        /* Get the indicies of all members */
        for (i=0, x=0; i < NumProgrammers; i++)
        {
            if (Member[i] == TRUE)
            {
                MemberIndex[x] = i;
                x++;
            }
        }

        /* Calculate the productivity rates */
        ProductivityTotal = 0;
        for (x=0; x<3; x++)
        {
            ProductivityTotal += PMatrix[MemberIndex[x]][MemberIndex[0]] +
                                 PMatrix[MemberIndex[x]][MemberIndex[1]] +
                                 PMatrix[MemberIndex[x]][MemberIndex[2]];
        }

        /* Replace the best value if we beat it */
        if (ProductivityTotal > MaxProductivityTotal)
        {
            MaxProductivity[0] = MemberIndex[0];
            MaxProductivity[1] = MemberIndex[1];
            MaxProductivity[2] = MemberIndex[2];
            MaxProductivityTotal = ProductivityTotal;
        }
    }
}

