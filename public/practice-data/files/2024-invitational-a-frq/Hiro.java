/*
 * UIL Computer Science 2024
 * Invitational A Packet Solution
 */

import java.io.*;
import static java.lang.System.*;
import java.util.*;

public class Hiro {
    public static void main(String[]args)throws Exception{
        new Hiro().run();
    }
    public void run()throws Exception{
        Scanner file=new Scanner(new File("hiro.dat"));
        int times=file.nextInt();
        file.nextLine();
        while(times-->0){
            String rom=file.nextLine().trim();
            int res=RomanToDecimal(rom);
            out.println(res);
        }
    }
    int RomanToDecimal(String str){
        int res = 0;
        for (int i = 0; i < str.length(); i++) {
            int s1 = value(str.charAt(i));
            if (i + 1 < str.length()) {
                int s2 = value(str.charAt(i + 1));
                if (s1 >= s2) {
                    res = res + s1;
                }
                else {
                    res = res + s2 - s1;
                    i++;
                }
            }
            else {
                res = res + s1;
            }
        }
        return res;
    }
    int value(char r)
    {
        if (r == 'I')
            return 1;
        if (r == 'V')
            return 5;
        if (r == 'X')
            return 10;
        if (r == 'L')
            return 50;
        if (r == 'C')
            return 100;
        if (r == 'D')
            return 500;
        if (r == 'M')
            return 1000;
        return -1;
    }
}
