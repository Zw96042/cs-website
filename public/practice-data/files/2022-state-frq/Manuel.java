/*
 * UIL Computer Science 2022
 * State Packet Solution
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
 
class Manuel
{
    public static void printArray(double[][] mat, char[] variables)
    {
        if(variables.length==2)
            System.out.printf("%c=%.3f,%c=%.3f\n",variables[0],mat[0][0],variables[1],mat[1][0]);
        else
            System.out.printf("%c=%.3f,%c=%.3f,%c=%.3f\n",variables[0],mat[0][0],variables[1],mat[1][0],variables[2],mat[2][0]);
    }

    public static double[][] inverse(int[][] mat)
    {
        double[][] inv=new double[mat.length][mat.length];
        double det=determinant(mat);
        if(mat.length==2)
        {
            int temp = mat[0][0];
            mat[0][0] = mat[1][1];
            mat[1][1] = temp;
            mat[0][1] = - mat[0][1];
            mat[1][0] = - mat[1][0];
            for(int i = 0; i < 2; ++i)
                for(int j = 0; j < 2; ++j)
                    inv[i][j]=mat[i][j]/det;
            return inv;
        }
        for(int i = 0; i < 3; ++i)
            for(int j = 0; j < 3; ++j)
                inv[i][j]=((mat[(j+1)%3][(i+1)%3] * mat[(j+2)%3][(i+2)%3]) - (mat[(j+1)%3][(i+2)%3] * mat[(j+2)%3][(i+1)%3]))/ det;

        return inv;
    }

    public static double determinant(int[][] mat)
    {
        double det=0;
        if(mat.length==2)
            return (mat[0][0] * mat[1][1]) - (mat[0][1] * mat[1][0]);

        for(int i = 0; i < 3; i++)
            det += (mat[0][i] * (mat[1][(i+1)%3] * mat[2][(i+2)%3] - mat[1][(i+2)%3] * mat[2][(i+1)%3]));
        return det;
    }

    public static double[][] multiply(double[][] A, int[][] B)
    {
        int row1=A.length, row2=B.length, col2=B[0].length;
        double C[][] = new double[row1][col2];
 
        for (int i = 0; i < row1; i++)
            for (int j = 0; j < col2; j++)
                for (int k = 0; k < row2; k++)
                {
                    C[i][j] += A[i][k] * B[k][j];
                    if(Math.abs(C[i][j])<.00000001)
                        C[i][j]=+0.0;
                }

        return C;
    }

    public static char[] getVariables(String s,int numVariables)
    {
        char[] variables=new char[numVariables];
        int index=0;
        for(int a=0;a<s.length();a++)
            if(Character.isLetter(s.charAt(a)))
                variables[index++]=s.charAt(a);

        return variables;
    }

    public static int[][] parseEquations(String[] equations)
    {
        char[] variables=getVariables(equations[0],equations.length);
        int[][] matrix=new int[equations.length][equations.length];
        for(int a=0;a<equations.length;a++)
        {
            for(int b=0;b<equations.length;b++)
            {
                if(b==0)
                    matrix[a][b]=Integer.parseInt(equations[a].substring(0,equations[a].indexOf(variables[0])));
                else if(b!=equations.length-1)
                    matrix[a][b]=Integer.parseInt(equations[a].substring(equations[a].indexOf(variables[b-1])+1,equations[a].indexOf(variables[b])));
                else
                    matrix[a][b]=Integer.parseInt(equations[a].substring(equations[a].indexOf(variables[b-1])+1,equations[a].indexOf('=')-1));
            }
        }
        return matrix;
    }

    public static int[][] getValues(String[] equations)
    {
        int[][] values=new int[equations.length][1];

        for(int a=0;a<equations.length;a++)
            values[a][0]=Integer.parseInt(equations[a].substring(equations[a].indexOf('=')+1));
        
        return values;
    }

    public static void main(String[] args) throws FileNotFoundException
    {
        Scanner s;
        if(args.length==0)
            s = new Scanner(new File("manuel.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int a=1;a<=numCases;a++)
        {
            int numEquations=s.nextInt();
            s.nextLine();
            String[] equations=new String[numEquations];
            for(int b=0;b<numEquations;b++)
                equations[b]=s.nextLine();
            if(determinant(parseEquations(equations))==0)
            {
                //either:
                //same line-> infinite solutions
                //parallel lines -> no solutions

                //GW: I can add this if needed, but I vote no right now
                continue;
            }
            char[] variables=getVariables(equations[0],equations.length);
            double[][] ans=multiply(inverse(parseEquations(equations)),getValues(equations));
            printArray(ans,variables);
        }
    }
}