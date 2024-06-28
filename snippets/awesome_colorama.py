from colorama import Back, Fore, Style, init

if __name__ == "__main__":
    init(autoreset=True)  # init(wrap=True) # windows
    print(Fore.RED + "some red text")
    print(Back.GREEN + "and with a green background")
    print(Style.DIM + "and in dim text")
    print(Style.RESET_ALL)
    print("back to normal now")

# https://www.cnblogs.com/xiao-apple36/p/9151883.html
