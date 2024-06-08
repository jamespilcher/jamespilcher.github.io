import re # pip install pathvalidate
# working dir is blog/2.0/generative
# loop through md files in ../md/
# for each md file
# copy base-entry.html to ../<sanitised first line of md file>.html
# change the string in new file: 'base-entry.md' to the name of the md file




# copy base-index.html to ../index.html
# for file in entries/ folder
# the second line of each file will be the date (in uk format)
# the first line of each file will be the title
# create a list that is sorted by date

# for each file in the list
# add a new entry to the list of entries
#                 <li><a href="FILENAME.html">[DATE] | [TITLE]</a></li> 
# child of ul with id 'entries'



import os
import shutil
from datetime import datetime

# wipe the entries folder contents but not the folder itself
# get cwd
[os.remove(os.path.join('../entries', f)) for f in os.listdir('../entries')]
# delete the index.html file
if os.path.exists('../index.html'):
    os.remove('../index.html')

# 

# Loop through md files in ../md/
md_names = [f for f in os.listdir('../md/') if f.endswith('.md')]

entry_data = []

for md_name in md_names:
    with open('../md/' + md_name, 'r') as f:
        if ' ' in md_name:
            raise ValueError('Spaces are not allowed in md file names. replace it with an underscore!')
        title = f.readline().strip()[2:]
        date_str = f.readline().strip()[1:-1]
        date = datetime.strptime(date_str, '%d/%m/%Y')
        html_name =  re.sub(r'\W+', '_', md_name[:-3]) + '.html'
        new_html_file = f'../entries/{html_name}'
        shutil.copyfile('base-entry.html', new_html_file)
        # Change the string in new file: 'base-entry.md' to the name of the md file
        with open(new_html_file, 'r+') as f:
            content = f.read()
            f.seek(0)
            f.write(content.replace('<title>base-head</title>', f'<title>{title}</title>\n'))
            f.write(content.replace('base-entry.md', md_name))
        entry_data.append({'date': date, 'title': title, 'md_name': md_name, 'html_name': html_name})

entry_data.sort(key=lambda x: x['date'], reverse=True)

# For each file in the list, add a new entry to the list of entries
with open('base-index.html', 'r') as index_file, open('../index.html', 'w') as temp_file:
    for line in index_file:
        temp_file.write(line)
        if line.strip() == '<ul id = "entries">':
            for entry in entry_data:
                # <li><a href="FILENAME.html">[DATE] | [TITLE]</a></li> 
                temp_file.write(f'<li><a href="entries/{entry["html_name"]}">{entry["date"].strftime("%d/%m/%Y")} | {entry["title"]}</a></li>\n')
