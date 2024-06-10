""" Script to generate html files for blog entries from markdown files. Updates index.html with the entries. """


import re
import os
import shutil
from datetime import datetime

[os.remove(os.path.join('../entries', f)) for f in os.listdir('../entries')]
if os.path.exists('../index.html'):
    os.remove('../index.html')

md_names = [f for f in os.listdir('../md/') if f.endswith('.md')]

entry_data = []

for md_name in md_names:
    with open('../md/' + md_name, 'r',  encoding='utf-8') as f:
        if ' ' in md_name:
            raise ValueError('Spaces are not allowed in md file names. replace it with an underscore!')
        print(md_name)
        title = f.readline().strip()[2:]
        date_str = f.readline().strip()[1:-1]
        print(date_str)
        date = datetime.strptime(date_str, '%d/%m/%y')
        html_name =  re.sub(r'\W+', '_', md_name[:-3]) + '.html'
        new_html_file = f'../entries/{html_name}'
        shutil.copyfile('base-entry.html', new_html_file)
        with open(new_html_file, 'r+') as f:
            content = f.read()
            f.seek(0)
            f.write(content.replace('base-entry.md', md_name))
        with open(new_html_file, 'r+') as f:
            content = f.read()
            f.seek(0)
            f.write(content.replace('<title>base-head</title>', f'<title>{title}</title>\n'))
            
        entry_data.append({'date': date, 'title': title, 'md_name': md_name, 'html_name': html_name})

entry_data.sort(key=lambda x: x['date'], reverse=True)

with open('base-index.html', 'r') as base_index_file, open('../index.html', 'w') as index_file:
    for line in base_index_file:
        index_file.write(line)
        if line.strip() == '<ul id = "entries">':
            for entry in entry_data:
                index_file.write(f'<li><a href="entries/{entry["html_name"]}">{entry["date"].strftime("%d/%m/%Y")} | {entry["title"]}</a></li>\n')
