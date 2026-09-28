import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.*;
 
class Michal
{
	public static void writeNumbers(String s)
	{
		//                       0     1     2     3     4     5     6
		String[] combinations={" _ ","| |","|_|","   ","  |"," _|","|_ "};
		String[][] numbers={{combinations[0],combinations[1],combinations[2],combinations[3]},//0
							{combinations[3],combinations[4],combinations[4],combinations[3]},//1
							{combinations[0],combinations[5],combinations[6],combinations[3]},//2
							{combinations[0],combinations[5],combinations[5],combinations[3]},//3
							{combinations[3],combinations[2],combinations[4],combinations[3]},//4
							{combinations[0],combinations[6],combinations[5],combinations[3]},//5
							{combinations[0],combinations[6],combinations[2],combinations[3]},//6
							{combinations[0],combinations[4],combinations[4],combinations[3]},//7
							{combinations[0],combinations[2],combinations[2],combinations[3]},//8
							{combinations[0],combinations[2],combinations[4],combinations[3]}//9
						};

		ArrayList<Integer> digits=new ArrayList<Integer>();
		for(int a=0;a<s.length();a++)
		{
			digits.add(Character.getNumericValue(s.charAt(a)));
		}

		for(int a=0;a<digits.size()*3+2;a++)
			System.out.print("*");
		System.out.println();

		for(int a=0;a<4;a++)
		{
			System.out.print("*");
			for(int b=0;b<digits.size();b++)
				{
					System.out.print(numbers[digits.get(b)][a]);
				}
				System.out.print("*");
				System.out.println();
		}

		for(int a=0;a<digits.size()*3+2;a++)
			System.out.print("*");
		System.out.println();
	}

	public static void main(String[] args) throws FileNotFoundException
    {
        Scanner s;
        if(args.length==0)
           s = new Scanner(new File("michal.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int a=1;a<=numCases;a++)
        {
			String num=s.nextLine();
			writeNumbers(num);
        }
    }
}