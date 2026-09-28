import java.io.*;
import static java.lang.System.*;
import java.lang.*;
import java.util.*;
import java.math.*;
import java.text.*;
public class AJ {
	
	public void run() throws Exception{
		Scanner file = new Scanner(new File("AJ.dat"));
		int times = file.nextInt();
		file.nextLine();
		while(times-- > 0) {
			char[] base = file.next().toCharArray();
			String hit = file.nextLine().trim(), o = "";
			if(hit.equals("Fly")) {
				if(base[2] == 'X')
					o += "3rd ";
				if(base[1] == 'X')
					o += "2nd ";
				if(base[0] == 'X')
					o += "1st ";
			}
			else if(hit.equals("Grounder")) {
				if(base[2] == 'X')
					o += "Home ";
				if(base[1] == 'X')
					o += "3rd ";
				if(base[0] == 'X')
					o += "2nd ";
				o += "1st ";
			}
			else
				o = "Give Up";
			if(o.length() == 0)o = "None";
			System.out.println(o.trim());
		}
	}
	
	public static void main(String[]args)throws Exception{
		new AJ().run();
	}
}
