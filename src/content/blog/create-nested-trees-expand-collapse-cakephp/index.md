---
title: 'Create nested trees that expand and collapse in CakePHP'
date: Sat, 24 Jan 2009 14:39:45 +0000
draft: false
tags: [CakePHP, CakePHP, javasccript, tree]
---

This is a horrible tittle, and I apologize.  What I mean is that we can **show nested items based on parent-child relationships that will expand and collapse with a simple, click.** The trick requires prototype and scriptalicious. The reason is ease of use and aesthetics.   If a user lands on a page, let's say 'Categories'  and sees all the categories sprawled out across the page they'll retreat in horror. [caption id="attachment_333" align="aligncenter" width="150" caption="Defaulting to expanded trees is overwhelming to visitors"]![Defaulting to expanded trees is overwhelming to visitors](expanded-150x150.webp "Expanded tree items - woah!")[/caption] Instead it would be much nicer to only show the top-most categories, and let them dive down where necessary. [caption id="attachment_334" align="aligncenter" width="150" caption="Showing the condensed tree is much more aesthetically pleasing"]![Showing the condensed tree is much more aesthetically pleasing](collapsed-150x150.webp "Collapsed trees allow for quicker navigation")[/caption] We can take it a step further by adding a nice slide effect so the sub-items rolldown like a window shade, and retreat in the same manner.  [See the sliding tree items here](http://thegreenlifelist.org/categories "Tree that uses javascript to slide sub-items or branches into view").

Using Nested Trees with Slide effect
------------------------------------

The feat is pretty straight forward and I walk through the code in 4 areas.

*   The Controller
*   The Layout
*   The View
*   The Helper

### The Controller to retrieve nested or threaded items

There is only a minor change here being that we use findAllThreaded.

	function index() {
		
		$this->set('isHunting',false);  //this tells my tree what type of link to use you prolly wont need this.
              // the rest is required
		$this->Category->recursive = 1;
		$data = $this->Category->findAllThreaded(null,null, 'name'); // Extra parameters added       
		$this->set('categories', $data);
  	
	}

### The Layout will load required JavaScript libraries

Our view is going to get a little trickier. We'll need to load Prototype and Scriptalicious in the layout.

Alternately, and preferably use the Javascript helper to load these libraries.

### The View to display our nested or threaded tree

Now because I have two types of trees (remember the 'isHunting' variable from our controller? I add this little snippet to specify the type of tree I need. You may decide one tree is suitable for your needs.

Please Select Category";
	echo $tree->showHunt('Category/name',$categories);
}else{
	echo "

Category Tree
-------------

";
	echo $tree->show('Category/name', $categories); 
}
?> 

If the variable 'isHunting' is true, then the tree items are links to send the visitor to another controller pre-populated. Otherwise they jump to the details about that Category.

### The Tree Helper

This is based on the original Tree helper found in the bakery by James Hall [http://bakery.cakephp.org/articles/view/threaded-lists](http://bakery.cakephp.org/articles/view/threaded-lists) It was just too static for my needs, so here's the enhanced version that leverages prototype and includes links as well as small icons to indicate whether the item is expanded or not. **The time it takes to slide out or in for a particular branch can be adjusted in the loadScript method. 'Chitlens' is the number of sub-items or branches below. This allows the velocity to remain steady by adjusting the total time accordingly.** Also the font-size is reduced by 3% on each sub-level. This code can be commented out to keep all levels the same size.

 
	function showHide(id,chitlens,thisLI){
		var x=document.getElementById(id);
		var minusx=document.getElementById('minusx');
		var plusx=document.getElementById('plusx');			
		if(x) {
			var timeToTake=.2*chitlens;
			var isHidden=x.style.display=='none';
			if(isHidden){
				Effect.Grow(id,{duration : timeToTake, direction :'top-left'});
					thisLI.innerHTML=minusx.innerHTML;
			}else{
				Effect.Shrink(id,{duration : timeToTake, direction :'top-left'});
				if(thisLI){
					thisLI.innerHTML=plusx.innerHTML;
				}
			}						
		}
	}   	
	
	";
   echo '

Click on the + to expand sub-levels

';
   }
   
   function getUniqueId($level){
   	$letter=chr(65+$level);
   	$ret=$letter.$this->uniqueId;
   	$this->uniqueId++;
   	return $ret;
   }
    
   function extraDivs(){
   	$output=''.$this->Html->image('icons/condense.png',array('alt'=>' - ')).'';
   	$output.=''.$this->Html->image('icons/expand.png',array('alt'=>' + ')).'';
   	return $output;
   }
   
  function show($name, $data)
  {
  	$output=$this->loadScript();
    list( $modelName, $fieldName) = explode('/', $name);
    $output .= $this->list_element($data, $modelName, $fieldName, 0);
   $output .= $this->extraDivs();
     
    return $this->output($output);
  }
  
  function showHunt($name, $data)
  {
  	$output=$this->loadScript();
    list( $modelName, $fieldName) = explode('/', $name);
    $output .= $this->list_element_hunt($data, $modelName, $fieldName, 0);
    $output .= $this->extraDivs();
    
    return $this->output($output);
  } 

  function list_element($data, $modelName, $fieldName, $level)
  {

  	 $tab="	";
  	 if($modelName=="Company") {
  	 	$modelPage="companies";
  	 }else if($modelName=="Category") {
  	 	$modelPage="categories";
  	 }
  	 
  
  	$bulletStyle='list-style-type:none';
  
    $tabs = "\n" . str_repeat($tab, $level * 2);
    $li_tabs = $tabs . $tab;
    
    $fontstyle='';
    if($level>0){
   		$fontpercent=100-$level*3;
   		$fontstyle='font-size:'.$fontpercent.'%;';
    }
    
     $output = $tabs. "

";
     foreach ($data as $key=>$val)
    {
     $hasChild=isset($val['children'][0]);
     $howmany=count($val['children']);
     
      if($hasChild)
      {
      	
      	$tId='tree'.$this->getUniqueId($level);
      	$hidDiv='

';    
        
      	$output .= $li_tabs . "*   ".
          				"".
          				$this->Html->image('icons/expand.png',array('alt'=>' + ')).
          				"".
          				$this->Html->link($val[$modelName][$fieldName],"/".$modelPage."/view/".$val[$modelName]['id']);
         
          	$output .= $hidDiv.$this->list_element($val['children'], $modelName, $fieldName, $level+1).'

';
        $output .= $li_tabs . "";
      }
      else
      {
      	$output .= $li_tabs . "*   ".
          				"".
          				$this->Html->image('icons/condense.png',array('alt'=>' - ')).
          				"".
          				$this->Html->link($val[$modelName][$fieldName],"/".$modelPage."/view/".$val[$modelName]['id']);
         
            $output .= "
";
      }
    }
    $output .= $tabs . "

";
    
    return $output;
  }
  
  
  function list_element_hunt($data, $modelName, $fieldName, $level)
  {

  	 $tab="	";
  	 if($modelName=="Company") {
  	 	$modelPage="companies";
  	 }else if($modelName=="Category") {
  	 	$modelPage="categories";
  	 }
  	 
  	
  	$bulletStyle='list-style-type:none';
  
    $tabs = "\n" . str_repeat($tab, $level * 2);
    $li_tabs = $tabs . $tab;
    
    $fontstyle='';
    if($level>0){
   		$fontpercent=100-$level*3;
   		$fontstyle='font-size:'.$fontpercent.'%;';
    }
    
     $output = $tabs. "

";
     foreach ($data as $key=>$val)
    {
     $hasChild=isset($val['children'][0]);
     $howmany=count($val['children']);
     
       if($hasChild)
      {
      	
      	$tId='tree'.$this->getUniqueId($level);
      	$hidDiv='

';    
        
      	$output .= $li_tabs . "*   ".
          				"".
          				$this->Html->image('icons/expand.png',array('alt'=>' + ')).
          				"".
          				$this->Html->link($val[$modelName][$fieldName],"/products/add/".$val[$modelName]['id'],array('title'=>'Add a new product using '.$val[$modelName][$fieldName]));
         
          	$output .= $hidDiv.$this->list_element($val['children'], $modelName, $fieldName, $level+1).'

';
        $output .= $li_tabs . "";
      }
      else
      {
      	$output .= $li_tabs . "*   ".
          				"".
          				$this->Html->image('icons/condense.png',array('alt'=>' - ')).
          				"".
          				$this->Html->link($val[$modelName][$fieldName],"/products/add/".$val[$modelName]['id'],array('title'=>'Add a new product using '.$val[$modelName][$fieldName]));
         
            $output .= "
";
      }
    }
    $output .= $tabs . "

";
    
    return $output;
  }
  
}
?>

**You'll notice some static references to Company and Category which could definitely be cleaned up to use the inflection class, but I just never got to it.** Additionally you can just eliminate the showHunt and list_elements_hunt methods. And remove the reference in the View if you only need one type of tree. Anyway thats it. I'm sure many of you will point out the repetitive code, lack of inflection and other areas that could use improvement, which is fine. I wrote this code quite a while back to land a prototyping job and just don;t care to update it. At least its a start for those without anything to go on. :)
