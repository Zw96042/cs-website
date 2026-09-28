import java.io.File;
import java.util.*;

public class Tesla {
    public static void main(String[] args) throws Throwable {
        new Tesla().run();
    }

    public void run() throws Throwable {
        Scanner sc = new Scanner(new File("tesla.dat"));

        // Map from item name to quantity
        Map<String, Integer> inventory = new HashMap<>();

        // Map from item name to category
        Map<String, String> itemCategory = new HashMap<>();

        int n = Integer.parseInt(sc.nextLine().trim());

        StringBuilder output = new StringBuilder();

        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            String[] parts = line.split(" ");
            String command = parts[0];

            switch (command) {
                case "ADD": {
                    String category = parts[1];
                    String item = parts[2];
                    int quantity = Integer.parseInt(parts[3]);

                    // Add quantity to existing or create new
                    inventory.put(item, inventory.getOrDefault(item, 0) + quantity);

                    // Only set category on first ADD (if not already set)
                    if (!itemCategory.containsKey(item)) {
                        itemCategory.put(item, category);
                    }
                    break;
                }

                case "REMOVE": {
                    String item = parts[1];
                    int quantity = Integer.parseInt(parts[2]);

                    if (inventory.containsKey(item)) {
                        int current = inventory.get(item);
                        int newQuantity = Math.max(0, current - quantity);
                        inventory.put(item, newQuantity);
                    }
                    // If item doesn't exist, ignore
                    break;
                }

                case "QUERY": {
                    String item = parts[1];
                    int quantity = inventory.getOrDefault(item, 0);
                    output.append(quantity).append("\n");
                    break;
                }

                case "CATEGORY": {
                    String category = parts[1];

                    // Find all items in this category with quantity > 0
                    List<String> itemsInCategory = new ArrayList<>();
                    int totalQuantity = 0;

                    for (Map.Entry<String, String> entry : itemCategory.entrySet()) {
                        String item = entry.getKey();
                        String cat = entry.getValue();

                        if (cat.equals(category)) {
                            int qty = inventory.getOrDefault(item, 0);
                            if (qty > 0) {
                                itemsInCategory.add(item);
                                totalQuantity += qty;
                            }
                        }
                    }

                    output.append(totalQuantity).append("\n");

                    if (itemsInCategory.isEmpty()) {
                        output.append("EMPTY").append("\n");
                    } else {
                        Collections.sort(itemsInCategory);
                        for (String item : itemsInCategory) {
                            output.append(item).append(" ").append(inventory.get(item)).append("\n");
                        }
                    }
                    break;
                }

                case "TOTAL": {
                    int count = 0;
                    for (int qty : inventory.values()) {
                        if (qty > 0) {
                            count++;
                        }
                    }
                    output.append(count).append("\n");
                    break;
                }

                case "LIST": {
                    // Get all items with quantity > 0
                    List<String> inStock = new ArrayList<>();
                    for (Map.Entry<String, Integer> entry : inventory.entrySet()) {
                        if (entry.getValue() > 0) {
                            inStock.add(entry.getKey());
                        }
                    }

                    if (inStock.isEmpty()) {
                        output.append("EMPTY").append("\n");
                    } else {
                        // Sort by category, then by item name
                        inStock.sort((a, b) -> {
                            String catA = itemCategory.get(a);
                            String catB = itemCategory.get(b);
                            if (!catA.equals(catB)) {
                                return catA.compareTo(catB);
                            }
                            return a.compareTo(b);
                        });

                        for (String item : inStock) {
                            output.append(itemCategory.get(item)).append(" ")
                                    .append(item).append(" ")
                                    .append(inventory.get(item)).append("\n");
                        }
                    }
                    break;
                }
            }
        }

        System.out.print(output);
        sc.close();
    }
}
