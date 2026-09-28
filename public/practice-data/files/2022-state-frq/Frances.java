/*
 * UIL Computer Science 2022
 * State Packet Solution
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.Arrays;
 
class Frances 
{
    public static boolean verify(int graph[][],String names[],String l)
    {
        String listArray[]=l.split(",");
        String listArrayClone[]=listArray.clone();
        String namesClone[]=names.clone();
        Arrays.sort(namesClone);
        Arrays.sort(listArrayClone);

        if(!Arrays.equals(namesClone,listArrayClone))
        {
            return false;
        }

        boolean[] visitedArray=new boolean[graph.length];
        for(int a=0;a<listArray.length;a++)
        {
            int index=getIndex(names,listArray[a]);
            visitedArray[index]=true;
            boolean[] reachable=visitedNodesInit(index,graph,new boolean[graph.length]);
            for(int b=0;b<reachable.length;b++)
                if(reachable[b]==true&&visitedArray[b]==true)
                    return false;
        }

        return true;
    }

    public static boolean[] visitedNodesInit(int start, int graph[][], boolean[] visited)
    {
        visited=visitedNodes(start,graph,visited);
        visited[start]=false;
        return visited;
    }

    public static boolean[] visitedNodes(int start, int graph[][], boolean[] visited)
    {
        visited[start] = true;
 
        for (int i = 0; i < graph[start].length; i++) 
        {
            if (graph[start][i] == 1 && (!visited[i])) 
                visitedNodes(i, graph,visited);
        }
        return visited;
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
            String tempSplit[]=relationships[a].split("->");
            int index1=getIndex(names,tempSplit[0]);
            int index2=getIndex(names,tempSplit[1]);
            graph[index1][index2]=1;
        }
        return graph;
    }

    public static void main(String[] args) throws FileNotFoundException
    {
        Scanner s;
        if(args.length==0)
           s = new Scanner(new File("frances.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int a=1;a<=numCases;a++)
        {
            String allNamesString=s.nextLine();
            String allNamesArray[]=allNamesString.split(",");
            String allRelationshipsString=s.nextLine();
            String listString=s.nextLine();
            String allDashes=s.nextLine();
            String allRelationshipsArray[]=allRelationshipsString.split(",");
            int graph[][]=makeGraph(allNamesArray,allRelationshipsArray);
            if(verify(graph,allNamesArray,listString))
                System.out.println("Degree plan #"+a+" is legal.");
            else
                System.out.println("Degree plan #"+a+" is illegal.");
        }
    }
}