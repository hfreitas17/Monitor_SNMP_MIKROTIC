@echo off
setlocal enabledelayedexpansion
set INTERVALO=1
set HOST=172.16.43.243
set COMUNIDADE=public
set OID_TX= 1.3.6.1.2.1.2.2.1.10.2
set OID_RX= 1.3.6.1.2.1.2.2.1.16.2

::"D:\Estudo\IFBA\2025\Proj. e Adm de Redes\Monitor SNMP\Projeto-e-Adm-de-Redes-SNMP\taxaTX.txt"
set ARQUIVO_TX=".\taxaTX.txt"
set ARQUIVO_RX=".\taxaRX.txt"


:loop
setlocal enabledelayedexpansion
for /F "tokens=1,2 delims=: " %%A in ("%TIME%") do set hora=%%A:%%B
:: Inicializa a variável antes da consulta SNMP
set TAXARX=
set TAXATX=

:: Captura apenas o valor do SNMP INTEGER
for /f "tokens=4" %%A in ('snmpwalk -v 2c -c %COMUNIDADE% %HOST% %OID_RX% ^| findstr "Counter32"') do (
    set TAXARX=%%A
)

for /f "tokens=4" %%A in ('snmpwalk -v 2c -c %COMUNIDADE% %HOST% %OID_TX% ^| findstr "Counter32"') do (
    set TAXATX=%%A
)

:: Usa a variável com expansão atrasada para garantir que os valores sejam resolvidos corretamente
echo !hora!, !TAXATX! >> %ARQUIVO_TX%
echo !hora!, !TAXARX! >> %ARQUIVO_RX%

timeout /t %INTERVALO% /nobreak
goto loop
