import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.*;
 
class Fai {

    public static boolean hasEulerCircuit(int graph[][])
    {
        int[] vertexCount=new int[graph.length];
        for(int x=0;x<graph.length;x++)
        {
            for(int y=0;y<graph.length;y++)
            {
                vertexCount[x]+=graph[x][y];
            }
            if(vertexCount[x]%2==1)
                return false;
        }
        return true;
    }

    public static int getIndex(String[] names, String name)
    {
        for(int a=0;a<names.length;a++)
            if(names[a].equals(name))
                return a;
        return -1;
    }

    public static int[][] makeGraph(String[] names, String[] relationships)
    {
        int graph[][]=new int[names.length][names.length];
        for(int a=0;a<relationships.length;a++)
        {
            String tempSplit[]=relationships[a].split("<->");
            int index1=getIndex(names,tempSplit[0]);
            int index2=getIndex(names,tempSplit[1]);
            graph[index1][index2]=1;
            graph[index2][index1]=1;
        }
        return graph;
    }

    public static void main(String[] args) throws FileNotFoundException
    {
        Scanner s;
        if(args.length==0)
           s = new Scanner(new File("fai.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int a=1;a<=numCases;a++)
        {
            String allNamesString=s.nextLine();
            String allNamesArray[]=allNamesString.split(",");
            String startCity=s.nextLine();
            String allRelationshipsString=s.nextLine();
            String allDashes=s.nextLine();
            String allRelationshipsArray[]=allRelationshipsString.split(",");
            int graph[][]=makeGraph(allNamesArray,allRelationshipsArray);
            if(hasEulerCircuit(graph))
                System.out.println("Test case " + a +": possible");
            else
                System.out.println("Test case " + a +": impossible");
        }
    }
}