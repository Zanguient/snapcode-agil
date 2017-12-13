Set WshShell = WScript.CreateObject("WScript.Shell") 
obj = WshShell.Run("""D:\Projects SVN\Agil\startup scripts\agil.bat""", 0) 
set WshShell = Nothing