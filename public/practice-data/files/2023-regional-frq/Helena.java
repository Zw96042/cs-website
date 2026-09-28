/*
 * UIL Computer Science 2023
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Helena {

	public static void main(String[] args) throws FileNotFoundException {

		Scanner data = new Scanner(new File("helena.dat"));
		int T = data.nextInt();
		for (int t = 1; t <= T; t++) {
			int wordsize = data.nextInt();
			int msgcount = data.nextInt();
			data.nextLine();  // dispose of newline
			for (int m = 1; m <= msgcount; m++) {
				StringBuilder msg = new StringBuilder(data.nextLine());
				StringBuilder codedmsg = new StringBuilder();
				while (msg.length() >= wordsize * 2) {
					StringBuilder temp1 = new StringBuilder(msg.substring(0,wordsize));
					msg = msg.delete(0,wordsize);
					StringBuilder temp2 = new StringBuilder(msg.substring(0,wordsize));
					msg = msg.delete(0,wordsize);
					codedmsg.append(temp2.reverse()).append(temp1.reverse());
				}
				if (msg.length() > 0) {
					int size = msg.length();
					if (size == 1) codedmsg.append(msg);
					else {
						size /= 2;
						if (msg.length() % 2 == 1) size++;
						StringBuilder temp = new StringBuilder(msg.substring(0,size));
						msg = msg.delete(0,size);
						codedmsg.append(msg.reverse()).append(temp.reverse());
					}
				}
				System.out.println("'" + codedmsg + "'");
			}
			System.out.printf("=========================\n");
		}
		data.close();
	}
}
