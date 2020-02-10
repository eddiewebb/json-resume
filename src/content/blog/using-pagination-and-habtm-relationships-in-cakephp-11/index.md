---
title: 'Using Pagination and HABTM relationships in CakePHP 1.1'
date: Wed, 21 May 2008 21:54:31 +0000
draft: false
---

So I love using the Pagination Helper and Pagination Components because they are so sweet and so easy. The trouble I hit was in HABTM relationships. An example is products and categories. A product like Apple can belong to Fruits and Food. And of course Food can have more products than just Apple, like Pizza and Burgers. So if our users view a Category page like 'Fruits' then we shouldn't show them pizza or burgers. Well if you want to do it using nice pagination helper, you can, read on.

Getting Started
---------------

To get the pagination components for Cakephp 1.1 , and learn how to use it in basic models, read [this article](http://bakery.cakephp.org/articles/view/pagination "Get started with pagination in CakePHP 1.1") by Andy Dawson. Got that working? Nice. Did you take advantage of the Ajax functionality? I hope so its easy enough. Anyway let's get to why you really came here.

Advancing to HABTM
------------------

For our example we will edit only 2 files, 3 if you don't have the HABTM model yet. For the action 'View' we will want to show all products that belong to this category in addition to details on the category itself. So when users land on the details page for 'Fruits' , the associated products would be items that matched, like 'apples', 'oranges', and 'bananas' but all other products like burgers should not show up.

### controllers/categories_controller.php

``function view($id = null) { if (!$id) { $this->Session->setFlash('Invalid id for Category.'); $this->redirect('/categories/index'); } $cat= $this->Category->read(null, $id); $this->set('category',$cat); $this->set('parent', $this->Category->findById($cat['Category']['parent_id'])); $this->set('children', $this->Category->findAll('`Category`.`parent_id`='.$id)); //allow products ot be sorted $this->Product->recursive=2; $criteria=null; list($order,$limit,$page) = $this->Pagination->init($criteria); // Added $criteria='`ProductsCategory`.`category_id`='.$id; $data = $this->ProductsCategory->findAll($criteria, null, $order, $limit, $page); // Extra parameters added $this->set('products', $data); }``

This will set up two variables to be used by our view, _$category_ and _$products_.

### views/categories/view.thtml

`

### Related Products

setPaging($paging); // Initialize the pagination variables /* *Create form to sort results */ echo $ajax->form(NULL,NULL,array("update" => $pagination->_pageDetails['ajaxDivUpdate'],"id"=>'paginationForm')); echo $pagination->resultsPerPageSelect()." "; $sorts = Array ( "id::ASC::Product", "id::DESC::Product", "name::ASC::Product", "name::DESC::Product", "name::ASC::Company", "name::DESC::Company" ); echo $pagination->sortBySelect($sorts); echo $ajax->submit("Submit",array("update" => $pagination->_pageDetails['ajaxDivUpdate'],"id"=>'paginationSubmit')); echo $ajax->observeForm('paginationForm',array("frequency"=>1,"update" => $pagination->_pageDetails['ajaxDivUpdate'])); echo "document.getElementById('paginationSubmit').hide();"; foreach ($products as $output) { //create td for values to add to array $actions=' '; if($rights>=2) $actions.=' '.$html->link('Edit','/products/edit/' . $output['Product']['id']); if($rights==4) $actions.=' '.$html->link('Delete','/products/delete/' . $output['Product']['id'], null, 'Are you sure you want to delete id ' . $output['Product']['name']); $id=$output['Product']['id']; $title=$html->link($output['Product']['name'], $goto.$output['Product']['id']); $company=$output['Company']['name']; $description=$output['Product']['description']; $image=$html->image('uploads/'.$output['Product']['imageurl'],array('width'=>'120','alt'=>'Product Image')); echo '

'; echo ''; echo ''; echo ''. ''; echo ''; echo '

'.$title.'
----------

'.$image.'

### Produced by:'.$company. '

'.$description.'

###### Added on '. $date->regularize($output['Product']['dateAdded']). '

'.$actions.'

'; echo '

'; }//end for each record echo $this->renderElement('pagination'); endif; ?>

`

Now in oder for the query you set up in the controller to work you need to have the proper associations in the product model, the category model, and the products_category model.

### models/Products_category.php

`array('className' => 'Category', 'foreignKey' => 'category_id', 'conditions' => '', 'fields' => '', 'order' => '', 'counterCache' => '' ), 'Product' => array('className' => 'Product', 'foreignKey' => 'product_id', 'conditions' => '', 'fields' => '', 'order' => '', 'counterCache' => '' ), ); } ?>`
