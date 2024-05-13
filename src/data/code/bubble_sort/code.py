def bubble_sort(arr): # 2
    n = len(arr) # 3
    for i in range(n - 1, 0, -1): # 4
        swapped = False # 5
        for j in range(i): # 6
            if arr[j] > arr[j+1]: # 7
                arr[j], arr[j+1] = arr[j+1], arr[j] # 8
                swapped = True # 9
        if not swapped: # 10
            break # 11

arr = [ 4, 2, 3, 1 ] # 0
bubble_sort(arr) # 1
print(arr) # 12

