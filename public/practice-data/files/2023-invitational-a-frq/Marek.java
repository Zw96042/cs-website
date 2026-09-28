/*
 * UIL Computer Science 2023
 * Invitational A Packet Solution
 */

import java.io.*;
import java.util.*;
public class Marek {
	boolean infinity;
	public static void main(String[]args)throws Exception{
		new Marek().run();
	}
	public void run() throws Exception{
		Scanner file=new Scanner(new File("marek.dat"));
		int num=file.nextInt();
		file.nextLine();
		while(num-->0) {
			infinity=false;
			String expr=file.nextLine().trim();
			String operators="()*+-/";
			String[]stuff=expr.replaceAll("\\s+"," ").split(" ");
			Stack<Integer> vals=new Stack<Integer>();
			Stack<Character>ops=new Stack<Character>();
			for(String s:stuff) {
				if(!operators.contains(s))
					vals.push(Integer.parseInt(s));
				else if(s.equals("("))
					ops.push(s.charAt(0));
				else if(s.equals(")")) {
					while(!ops.peek().equals('(')) 
						vals.push(solve(ops.pop(),vals.pop(),vals.pop()));
					ops.pop();
				}
				else if(operators.contains(s)) {
					char curr=s.charAt(0);
					while(!ops.empty() && prec(curr, ops.peek()))
						vals.push(solve(ops.pop(), vals.pop(), vals.pop()));
					ops.push(curr);
				}
			}
			while(!ops.empty()) 
				vals.push(solve(ops.pop(), vals.pop(), vals.pop()));
			if(infinity) {
				System.out.println("Infinity.");
				continue;
			}
			System.out.println(vals.pop());
		}
	}
	public int solve(char op, int v2, int v1) {
		switch(op) {
		case '+': return v1 + v2;
		case '-': return v1 - v2;
		case '*': return v1 * v2;
		case '/': 
			if(v2 == 0) {
				infinity=true;
				return 0;
			}
			return v1 / v2;
		}
		return 0;
	}
	public boolean prec(char op1, char op2) {
		if (op2 == '(' || op2 == ')')
            return false;
        if ((op1 == '*' || op1 == '/') &&
            (op2 == '+' || op2 == '-'))
            return false;
        else
            return true;
	}
}
