const fs = require('fs');
const YAML = require('json-to-pretty-yaml');

// TODO: Get from env
const collections = ['blog', 'profiles'];

for (let i = 0; i < collections.length; i++) {
  const collection = collections[i];
  // Get all the files in the collections folder
  fs.readdir(`./src/content/${collection}`, 'utf8', function(err, files){
    
    if(err){
      console.log(err);
      return;
    }
  
    console.log(`📝 Formatting ${collection} collection now...`)
    // Loop through all the files in the collection folder
    for (let j = 0; j < files.length; j++) {
      const fileName = files[j];
  
      fs.readFile(`./src/content/${collection}/${fileName}`, 'utf8', function(err, dataFile){
        
        if(err){
          console.log(err);
          return;
        }
        
        // Parse the filename
        const mdName = fileName.replace(/json/g, 'md');
        const parsedName = mdName.replace(/_/g, '-');
        var newFilePath = `./src/content/${collection}/${parsedName}`
  
        // Parse JSON data file and turn the front matter into formatted yaml
        const jsonObj = JSON.parse(dataFile)
        const { content_markdown, ...frontMatterData } = jsonObj;
        const frontMatter = "---\n" + YAML.stringify(frontMatterData) + "---\n";
  
        // Add the markdown content underneath the formatted yaml
        const totalPage = frontMatter + "\n" + content_markdown;
        
        // Create new markdown file
        fs.writeFile(newFilePath, totalPage, function (err) {
          if (err) throw err;
          console.log(`${parsedName} is created successfully.`);
        });
      });
  
      // Delete old JSON file
      fs.unlink(`./src/content/${collection}/` + fileName, (err) => {
        if (err) {
            throw err;
        }
        console.log(`Delete ${fileName} successfully.`);
      }); 
    }
  });
}

