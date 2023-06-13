# Certi-Gen

Introducing Certi-Gen.
Generate mass certificates for any event! Simply upload your template certificate (.png, .jpg, .jpeg) and an excel sheet (.xls, .xlsx), choose the font size and upload a custom font(optional) and hit the generate certificates button!

Within minutes (depending on how big your excel sheet is), it will generate all the certificates in "pdf" format and create a zip file which you can download and unzip!

NOTE:-

1. Excel sheet should contain only one column (feature) named "Name" under which all the names of the participants should be there.
2. All the names will be written in "Montserrat - ALL BLACK" font if no font file is uploaded. The font file should be in .ttf extention. (True Type Font)
3. All the names will be written in the middle of the certificate so make sure to design your template certificate accordingly. The script takes the Width and the Height of the template certificate uploaded, calculates the origin point and starts writing the name. Thats why all the names are in the middle. It also readjusts the font size if any name is longer than the template.

Developed by [Manav Garg](https://github.com/manavvgarg)
