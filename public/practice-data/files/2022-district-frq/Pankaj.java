import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.*;
 
class Pankaj {

    public static boolean isBipartiteHelper(int graph[][], int source, int colorArray[])
    {
        colorArray[source] = 1;
 
        LinkedList<Integer> list = new LinkedList<Integer>();
        list.push(source);
 
        while (!list.isEmpty())
        {
            int u = list.pop();
 
            for (int v = 0; v < graph.length; ++v)
                if (graph[u][v] == 1 && colorArray[v] == 0)
                {
                    colorArray[v] = colorArray[u] * -1;
                    list.push(v);
                }
                else if (graph[u][v] == 1 && colorArray[v] == colorArray[u]) 
                    return false;
        }

        return true;
    }
 
    public static boolean isBipartite(int graph[][])
    {
        int colorArray[] = new int[graph.length];

        for (int i = 0; i < graph.length; i++)
            if (colorArray[i] == 0)
                if (!isBipartiteHelper(graph, i, colorArray) )
                    return false;

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
           s = new Scanner(new File("pankaj.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int a=1;a<=numCases;a++)
        {
            String allNamesString=s.nextLine();
            String allNamesArray[]=allNamesString.split(",");
            String allRelationshipsString=s.nextLine();
            String allRelationshipsArray[]=allRelationshipsString.split(",");
            int graph[][]=makeGraph(allNamesArray,allRelationshipsArray);
            if(isBipartite(graph))
                System.out.println("Test case " + a +": possible");
            else
                System.out.println("Test case " + a +": impossible");
        }
    }
}