def f(n):
    for i in range(1, n+1):
        # prevent early return, if 15 is checked by 3 or 5, it will return either fizz or buzz instead of fizzbuzz
        if i % 3 == 0 and i % 5 == 0:
            print("fizzbuzz")
        elif i % 3 == 0:
            print("fizz")
        elif i % 5 == 0:
            print("buzz")
        else:
            print(i)

f(15)

