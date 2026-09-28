/*
 * UIL Computer Science 2024
 * District Packet Solution
 */

import java.util.*;
import java.io.*;

public class Ariel {
    public static void main(String[]args)throws Exception{
        new Ariel().run();
    }
    
    public int tr(String h){
        String[]s = h.split(":");
        int n = Integer.parseInt(s[0]) * 12;
        n += Integer.parseInt(s[1]) / 5;
        return n;
    }

    public void run()throws Exception{
        Scanner file=new Scanner(new File("ariel.dat"));
        int times=file.nextInt();
        file.nextLine();
        while(times-->0){
            String[] arr = file.nextLine().trim().split("\\s+");
            String[] dep = file.nextLine().trim().split("\\s+");
            int[] trains = new int[288];
            for(int y = 0; y < arr.length; y++){
                int st = tr(arr[y]);
                int end = tr(dep[y]);
                if(end < st){
                    for(int x = end; x < st - 1; x++) {
                        trains[x]--;
                    }
                    st = 0;
                    end = 288;
                }
                for(int x = st; x < end; x++) {
                    trains[x]++;
                }
            }
            System.out.println(max(trains));
        }
    }

    public int max(int[]arr){
        int max = Integer.MIN_VALUE;
        for(int i:arr)
            max = Math.max(i, max);
        return max;
    }
}
