def merge(arr, start, mid, end): # 11
    left_arr = arr[start:mid+1] # 12
    right_arr = arr[mid+1:end+1] # 13

    left = 0
    right = 0
    out = start # 14

    while left < len(left_arr) and right < len(right_arr): # 15
        if left_arr[left] <= right_arr[right]: # 16
            arr[out] = left_arr[left] # 17
            left += 1 # 18
        else: # 19
            arr[out] = right_arr[right] # 20
            right += 1 # 21
        out += 1 # 22

    while left < len(left_arr): # 23
        arr[out] = left_arr[left] # 24
        left += 1 # 25
        out += 1 # 26

def sort(arr, start, end): # 4
    if start >= end: # 5
        return # 6

    mid = (start + end) // 2 # 7

    sort(arr, start, mid) # 8
    sort(arr, mid+1, end) # 9
    merge(arr, start, mid, end) # 10

def merge_sort(arr): # 2
    sort(arr, 0, len(arr)-1) # 3

arr = [ ] # 0
merge_sort(arr) # 1
print(arr) # 27

