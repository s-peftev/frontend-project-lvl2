### GENDIFF:

[![Actions Status](https://github.com/s-peftev/frontend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/s-peftev/frontend-project-lvl2/actions) [![Actions Status](https://github.com/s-peftev/frontend-project-lvl2/workflows/Node-CI/badge.svg)](https://github.com/s-peftev/frontend-project-lvl2/actions) [![Actions Status](https://api.codeclimate.com/v1/badges/17bbc99ec163ab7261dc/maintainability)](https://codeclimate.com/github/s-peftev/frontend-project-lvl2/maintainability) [![Actions Status](https://api.codeclimate.com/v1/badges/17bbc99ec163ab7261dc/test_coverage)](https://codeclimate.com/github/s-peftev/frontend-project-lvl2/test_coverage")

This CLI app provides comparing of two given configuration files.
Supporting file formats: .json | .yml

### Installation

---

```console
git clone git@github.com:s-peftev/frontend-project-lvl2.git
cd frontend-project-lvl2
make install
npm link
```

### Usage

---

```console
gendiff -h
Usage: gendiff [options] <filepath1> <filepath2>

Compares two configuration files and shows a difference.
Options:
  -V, --version        output the version number
  -f, --format <type>  output format (default: "stylish")
  -h, --help           display help for command
```

- Comparing stylish format

jsonFile1.json

```json
{
  "common": {
    "setting1": "Value 1",
    "setting2": 200,
    "setting3": true,
    "setting6": {
      "key": "value",
      "doge": false
    }
  },
  "group1": {
    "baz": "bas",
    "foo": "bar",
    "nest": {
      "key": "value"
    }
  },
  "group2": {
    "abc": 12345,
    "deep": {
      "id": 45
    }
  }
}
```

jsonFile2.json

```json
{
  "common": {
    "follow": false,
    "setting1": "Value 1",
    "setting3": null,
    "setting4": "blah blah",
    "setting5": {
      "key5": "value5"
    },
    "setting6": {
      "key": "value",
      "ops": "vops",
      "doge": {
        "wow": "so much"
      }
    }
  },
  "group1": {
    "foo": "bar",
    "baz": "bars",
    "nest": "str"
  },
  "group3": {
    "deep": {
      "id": {
        "number": 45
      }
    },
    "fee": 100500
  }
}
```

```console
gendiff jsonFile1.json jsonFile2.json
{                            
    common: {                
      + follow: false        
        setting1: Value 1    
      - setting2: 200        
      - setting3: true       
      + setting3: null       
      + setting4: blah blah  
      + setting5: {          
            key5: value5     
        }                    
        setting6: {          
          - doge: false      
          + doge: {          
                wow: so much 
            }                
            key: value       
          + ops: vops        
        }                    
    }                        
    group1: {                
      - baz: bas             
      + baz: bars            
        foo: bar             
      - nest: {              
            key: value       
        }                    
      + nest: str            
    }                        
  - group2: {                
        abc: 12345           
        deep: {              
            id: 45           
        }                    
    }                        
  + group3: {                
        deep: {              
            id: {            
                number: 45   
            }                
        }                    
        fee: 100500          
    }                        
}                            
```

- Comparing plain format

yamlFile1.yml

```yaml
common:
  setting1: "Value 1"
  setting2: 200
  setting3: true
  setting6:
    key: "value"
    doge: false

group1:
  baz: "bas"
  foo: "bar"
  nest:
    key: "value"

group2:
  abc: 12345
  deep:
    id: 45
```

yamlFile2.yml

```yaml
common:
  follow: false
  setting1: "Value 1"
  setting3: null
  setting4: "blah blah"
  setting5:
    key5: "value5"
  setting6:
    key: "value"
    ops: "vops"
    doge:
      wow: "so much"

group1:
  foo: "bar"
  baz: "bars"
  nest: "str"

group3:
  deep:
    id:
      number: 45
  fee: 100500
```

```console
gendiff yamlFile1.yml yamlFile2.yml --format plain
Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge' was updated. From false to [complex value]
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]
```
