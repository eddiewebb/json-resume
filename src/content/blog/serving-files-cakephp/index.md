---
title: 'Serving up Files from a database in CakePHP'
date: Sun, 27 Jul 2008 13:03:32 +0000
draft: false
tags: [blob, CakePHP, CakePHP, database, file server]
---

This article is mostly in response to Daniel Hofstetter's great article, [File Upload with CakePHP](http://cakebaker.42dh.com/2006/04/15/file-upload-with-cakephp/) which explains how to save uploaded files in their own database table. In his example (I assume for the sake of space and time in the article) he serves the files right from his controller. This is not true to the MVC format however, so I wanted to provide an alternative for those who were unsure how to separate the two. **For those of you who ask, why store and serve files (pdfs, images, etc) from a database**, and not just save it do a directory. Well I can't speak for everyone, buts here is my reasoning;

*   Security
    
    Only users with proper credentials are allowed to view the file. No direct url to 'bypass.'
    
*   Integrity
    
    Files associated with posts or users can be automatically deleted when that post or user is.
    
*   Maintenance
    
    I can deploy an update to my server and overwrite the existing structure without losing a single meta file.
    

Below is the code for the model, the controller, view and layout. I also included the recommended way to make the calls from your existing views.

Controller
----------

##### /app/controllers/project_files_controller.php

Start by adding the code below into your controller, I created a fresh controller dedicated to project files. This allows users to add pdfs and other documents to scholar research projects.

    function download($id) {
       //I like to restrict this to logged in users

         $user=$this->Session->read('User');
         if(!isset($user['User'])){
            $this->Session->setFlash("Ya'lls gots'ta be logged in fer to fetch these pages");
            $this->redirect('/posts');
        }
       //IMPORTANT!  turn off debug output, will corrupt filestream.      
        Configure::write('debug', 0);
        $this->ProjectFile->recursive=-1;
        $file = $this->ProjectFile->findById($id,'user_id = '.$user['User']['id']);
      
       //just in case its been deleted, or someone is getting frisky
        if(!isset($file['ProjectFile']['name'])){
            $this->Session->setFlash("Problem. Either;

*   We no longer have that file
*   We never did.
*   You don't have rights

");
            $this->redirect('/posts');
           
        }
        //set the file variabl up for use in our view
        $this->set('file',$file);

        // we'll use a new layout, file, that will allow custom headers
        $this->render(null,'file');
    }

    function show($id) {
      //set up a variable, so the view well knwo to show it, not prompt to download
     $this->set('inpage',true);

//in my actual controller i do some logic here to set up an array of ''allowed file ids''  but to kepp it simple, well assume everyone can see

       //IMPORTANT!  turn off debug output, will corrupt filestream.      
        Configure::write('debug', 0);
        $this->ProjectFile->recursive=-1;
        $file = $this->ProjectFile->findById($id,'user_id = '.$user['User']['id']);
      
        if(!isset($file['ProjectFile']['name']) || substr($file['ProjectFile']['type'],0,5)!='image'){
            echo 'Not an image file';
            exit;           
        }
        //set the file variabl up for use in our view
        $this->set('file',$file);

        // we'll use our new layout, file,BUT well also use the same view, download
        $this->render('download','file');
    }

Model
-----

##### /app/models/project_file.php

The model is pretty straight-forward, and just declares the relationships.

 array('className' => 'User',
								'foreignKey' => 'user_id',
								'conditions' => '',
								'fields' => '',
								'order' => ''
			),
			'Project' => array('className' => 'Project',
								'foreignKey' => 'project_id',
								'conditions' => '',
								'fields' => '',
								'order' => ''
			)
	);
}
?>

Related or Parent Model
-----------------------

_Recommended_
-------------

##### /app/models/project.php

To enforce referential integrity, i.e. have files deleted when parents are deleted, than add the following to your 'parent' model.

	//The Associations below have been created with all possible keys, those that are not needed can be removed
	var $hasMany = array(
			'ProjectFile' => array('className' => 'ProjectFile',
								'foreignKey' => 'project_id',
								'dependent' => true,
								'conditions' => '',
								'fields' => '',
								'order' => '',
								'limit' => '',
								'offset' => '',
								'exclusive' => '',
								'finderQuery' => '',
								'counterQuery' => ''
			)
	);

Layout
------

##### /app/views/layouts/file.ctp

Next we create a special layout that will tell your browser the stream is a file, not html.

_Remember the view above serves both download and show actions in the controller. The 'Content-Disposition' is what will cause the browser to treat it like a download or load it in page. The variable '$inpage' is used by our controller and layout to know whether to prompt for download or not._

View
----

##### /app/views/project_files/download.ctp

Finally we create the actual view to push the file stream out to our user.

Example: Displaying files in pages
----------------------------------

Now you can use the show method to allow users to see images without downloading them. You can leverage this to show images within your posts or pages in the same manner

##### /app/views/projects/view.ctp (example page to show images)

This code would go in my projects views, for you it might be the user profile page or an article.

echo $html->image(array('controller'=>'project_files','action'=>'show',$project['ProjectFile']['id']),array('title'=>'This is a related file to a project'));

//alternately

echo '![](/project_files/show/174 "This is a related file to a project")';

**Note: This trick can also be used to create download-able xml and other text based files like code snippets. This makes it easy for users to sve the file rather than having to copy and paste.** Enjoy.
