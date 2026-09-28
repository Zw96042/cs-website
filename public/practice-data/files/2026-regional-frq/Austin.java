import java.io.*;
import static java.lang.System.*;
import java.lang.*;
import java.util.*;
import java.math.*;
import java.text.*;
public class Austin {
	
	public void run() throws Exception{
		Scanner file = new Scanner(new File("austin.dat"));
		int times = file.nextInt();
		file.nextLine();
		String[] message = new String[times];
		while(times-- > 0) {
			int seq = file.nextInt();
			String str = file.nextLine().trim();
			message[seq - 1] = str.substring(1, str.length() - 1);
		}
		for(String s:message)
			out.print(s);
		out.println();
	}
	
	public static void main(String[]args)throws Exception{
		new Austin().run();
	}
}
