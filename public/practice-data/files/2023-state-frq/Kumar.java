/*
 * UIL Computer Science 2023
 * State Packet Solution
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Kumar
{
	public static class Rational
    {
        long numerator;
        long denominator;

        public Rational()
        {
            numerator=0;
            denominator=1;
        }

        public Rational(long n, long d)
        {
            numerator=n;
            denominator=d;
        }

        long getNumerator()
        {
            return numerator;
        }

        long getDenominator()
        {
            return denominator;
        }

        void setNumerator(long n)
        {
            numerator=n;
        }

        void setDenominator(long d)
        {
            denominator=d;
        }

        public void reduce()
        {
            long myGCD = gcd(numerator, denominator);
    
            if (denominator < 0)
                myGCD = myGCD * -1;
    
            numerator = numerator / myGCD;
            denominator = denominator / myGCD;
        }

        Rational add(Rational addend)
        {
            Rational sum=new Rational();
            long lcm;

            lcm = lcm(getDenominator(), addend.getDenominator());

            sum.setNumerator(lcm / getDenominator() * getNumerator() +
                           lcm / addend.getDenominator() * addend.getNumerator());
            sum.setDenominator(lcm);
            sum.reduce();

            return sum;
        }

        Rational multiply(Rational multiplicand)
        {
            Rational product=new Rational();

            product.setNumerator(getNumerator() * multiplicand.getNumerator());
            product.setDenominator(getDenominator() * multiplicand.getDenominator());
            product.reduce();

            return product;
        }

        Rational multiplicativeInverse()
        {
            return new Rational(getDenominator(), getNumerator());
        }

        Rational divide(Rational divisor)
        {
            return multiply(divisor.multiplicativeInverse());
        }

        public String toString()
        {
            return ""+numerator+"/"+denominator;
        }
    }

    public static long lcm(long m, long n)
    {
		long lcm;

		if (m == 0 && n == 0)
			lcm = 0;
		else
			lcm = m * n / gcd(m, n);

		return Math.abs(lcm);
    }

    public static long gcd(long a, long b)
    {
        if (a == 0)
            return b;

        return gcd(b % a, a);
    }

    static String longestRepeatedSubstring(String str)
    {
        int n = str.length();
        int LCSRe[][] = new int[n + 1][n + 1];
 
        String res = "";
        int res_length = 0;
 
        int i, index = 0;
        for (i = 1; i <= n; i++)
        {
            for (int j = i + 1; j <= n; j++)
            {
                if (str.charAt(i - 1) == str.charAt(j - 1) && LCSRe[i - 1][j - 1] < (j - i))
                {
                    LCSRe[i][j] = LCSRe[i - 1][j - 1] + 1;
 
                    if (LCSRe[i][j] > res_length)
                    {
                        res_length = LCSRe[i][j];
                        index = Math.max(i, index);
                    }
                }
                else
                {
                    LCSRe[i][j] = 0;
                }
            }
        }
 
        if (res_length > 0)
        {
            for (i = index - res_length + 1; i <= index; i++) 
            {
                res += str.charAt(i - 1);
            }
        }
 
        return res;
    }

    public static int numberOfOccurances(String origString, String str)
    {
        if(str.length()<=0)
            return -1;

        int count=0;
        int index=0;
        while(index<origString.length())
        {
            String temp=origString.substring(index);
            int indexInString=temp.indexOf(str);
            if(indexInString==0)
            {
                count++;
                index+=indexInString+str.length();
            }
            else
            {
                break;
            }
        }
        return count;
    }

    public static Rational convert(String decimalOnly)
    {
        double numerator=Double.parseDouble(decimalOnly);
        double denominator=1;

        int count=decimalOnly.length()-1;//account for decimal place

        numerator*=Math.pow(10,count);
        denominator*=Math.pow(10,count);

        Rational r = new Rational((long)numerator,(long)denominator);
        r.reduce();
        return r;
    }

	public static void main(String args[]) throws FileNotFoundException
	{
		Scanner s;
        if(args.length==0)
           s = new Scanner(new File("kumar.dat"));
        else
            s = new Scanner(new File(args[0]));

		int N = s.nextInt();
		s.nextLine();

		for ( int n = 1; n <= N; n++ )
		{
			String line=s.nextLine();
			if(line.contains("..."))
			{
				//repeating decimal
				String str=line.substring(0,line.indexOf("..."));
		        str=str.substring(str.indexOf(".")+1);
		        String repeated="";
		        int repeatedStart=-1;
		        for(int a=0;a<str.length();a++)
		        {
		            String shortenedString=str.substring(a);
		            String temp=longestRepeatedSubstring(shortenedString);

		            int numOccur=numberOfOccurances(shortenedString,temp);
		            if(numOccur>=3)
		            {
		                repeated=temp;
		                repeatedStart=a;
		                break;
		            }
		        }

	            String digitsBeforeRepeat=str.substring(0,repeatedStart);

	            long digitsBeforeRepeatInt=0;
	            if(digitsBeforeRepeat.length()!=0)
	                digitsBeforeRepeatInt=Long.parseLong(digitsBeforeRepeat);
	            
	            long repeatInt=Long.parseLong(repeated);

	            long lastDivideNum=(long)Math.pow(10,digitsBeforeRepeat.length());
	            
	            long lastDivideDenom=1;

	            long firstNumerator=repeatInt;
	            long firstDenominator=(long)Math.pow(10,repeated.length())-1;

	            Rational r1=new Rational(firstNumerator,firstDenominator);
	            Rational r2=new Rational(digitsBeforeRepeatInt,1);
	            Rational sum=r1.add(r2);

	            Rational lastDivide=new Rational(lastDivideNum,lastDivideDenom);

	            Rational finalDivide=sum.divide(lastDivide);
	            finalDivide.reduce();

	            System.out.println(line + " is equivalent to " + finalDivide.toString());
		        
			}
			else
			{
				String decimalOnly=line.substring(line.indexOf('.'));

				Rational r = convert(decimalOnly);

				System.out.println(line + " is equivalent to " + r.toString());
			}
		}
	}
}