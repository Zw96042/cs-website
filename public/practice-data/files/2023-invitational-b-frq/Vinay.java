/*
 * UIL Computer Science 2023
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Vinay
{
    public static long factorial(long i)
    {
        long product=1;
        for(long a=1;a<=i;a++)
            product*=a;
        return product;
    }

    public static long canMakePalindrome(String s)
    {
        int[] count=new int[128];

        long numDifferentPalindrome=0;

        for(int a=0;a<s.length();a++)
        {
            char temp=Character.toUpperCase(s.charAt(a));
            count[(int)temp]++;
        }

        int numOdd=0;
        for(int a=0;a<count.length;a++)
        {
            if(count[a]%2==1)
                numOdd++;
            count[a]/=2;
        }

        if (numOdd<=1)
        {
            numDifferentPalindrome=1;
            long numerator=0;
            long denominator=1;
            for(int a=0;a<count.length;a++)
            {
                if(count[a]>0)
                {
                    numerator+=count[a];
                    denominator*=factorial(count[a]);
                }

            }
            numDifferentPalindrome=(factorial(numerator))/denominator;
        }
        return numDifferentPalindrome;
    }
    public static void main(String args[]) throws FileNotFoundException
    {
        Scanner s;
        if(args.length==0)
           s = new Scanner(new File("vinay.dat"));
        else
            s = new Scanner(new File(args[0]));

        int N = s.nextInt();
        s.nextLine();
        for ( int n = 1; n <= N; n++ )
        {
            String line=s.nextLine();
            String orig=line;

            String[] words = line.replaceAll("[^0-9a-zA-Z ]", "").toLowerCase().split("\\s+");

            String concat="";

            for(int a=0;a<words.length;a++)
                concat+=words[a];

            long result = canMakePalindrome(concat);
            if (result!=0)
                System.out.println(orig + " can be rearranged to form " + result + " distinct palindrome(s).");
            else
                System.out.println(line + " can not be rearranged to form a palindrome.");
        }
        s.close();
    }
}