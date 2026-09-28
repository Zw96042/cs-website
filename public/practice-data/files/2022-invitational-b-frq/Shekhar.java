import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.*;
import java.io.*;
public class Shekhar
{
	public static void main(String args[]) throws FileNotFoundException
	{
		Scanner s;
		if(args.length==0)
           s = new Scanner(new File("shekhar.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int i=1;i<=numCases;i++)
        {
        	String input=s.nextLine();
        	Stack<Character> myStack = new Stack<Character>();
        	boolean correct=true;
        	for(int a=0;a<input.length();a++)
        	{
        		char temp=input.charAt(a);
        		if(temp!='('&&temp!=')'&&temp!='['&&temp!=']'&&temp!='{'&&temp!='}')
        			continue;
        		else
        		{
        			if(temp=='('||temp=='{'||temp=='[')
        				myStack.push(temp);
        			else
        			{
        				if(myStack.empty()==true)
        				{
        					correct=false;
        					break;
        				}
        				char topOfStack=myStack.pop();
        				if((temp==')'&&topOfStack=='(')||(temp=='}'&&topOfStack=='{')||(temp==']'&&topOfStack=='['))
        					continue;
        				else
        				{
        					correct=false;
        					break;
        				}
        			}
        		}
        	}
        	if(correct&&myStack.empty()==true)
        		System.out.println(input + " is nested correctly");
        	else
        		System.out.println(input + " is nested incorrectly");
        }
	}
}