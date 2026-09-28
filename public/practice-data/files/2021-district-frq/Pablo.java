import java.util.*;
import java.io.*;
import static java.lang.System.out;
public class Pablo {

	public static void main(String[] args) throws IOException{
		Scanner file = new Scanner(new File("pablo.dat"));
		final int R = 6371;
		int n = file.nextInt();
		for(int x = 1; x <= n; x++) {
			double lat1 = file.nextDouble();
			double lon1 = file.nextDouble();
			double lat2 = file.nextDouble();
			double lon2 = file.nextDouble();
			double latDiff = Math.toRadians(lat2-lat1);
			double lonDiff = Math.toRadians(lon2-lon1);
			double a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
			double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			double distance = R * c;
			out.printf("The distance between (%1.5f, %1.5f) and (%1.5f, %1.5f) is %1d meters.\n",lat1,lon1,lat2,lon2,Math.round(distance * 1000));
		}

	}

}
