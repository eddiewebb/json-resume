---
title: 'Using CakePHP Pagination with HABTM tables.'
date: Wed, 21 May 2008 22:25:08 +0000
draft: false
tags: [1.1, CakePHP, CakePHP, HABTM, pagination]
---

**This works with CakePHP Version 1.1 Only !** Version 1.2 has paginate component built in. So **I love using the Pagination Helper and Pagination Components because they are so sweet and so easy**. The trouble I hit was in HABTM relationships. An example is product categories. A product like Apple may belong to many categories like Fruits and Food. The category Food may have several products, such as Apples, Pizzas and Burgers. So if our users view a Category page like 'Fruits' then we want to be able to restrict the items shown to the Fruit category, but keep our pagination. It can be done with little effort.

Getting Started
---------------

To get the pagination components for Cakephp 1.1 , and learn how to use it in basic models, read [this article](http://bakery.cakephp.org/articles/view/pagination "Get started with pagination in CakePHP 1.1") by Andy Dawson. Once you understand it's use with a simple model, we can apply it to a Has And Belongs To Many model.

Advancing to HABTM
------------------

For our example we will edit only 2 files, 3 if you don't have the HABTM model yet. For the action 'View' we will want to show all products that belong to this category in addition to details on the category itself. So when users land on the details page for 'Fruits' , the associated products would be items that matched, like 'apples', 'oranges', and 'bananas' but all other products like burgers should not show up.

controllers/categories_controller.php
-------------------------------------

function view($id = null) {
	if (!$id) {
		$this->Session->setFlash('Invalid id for Category.');
		$this->redirect('/categories/index');
	}
	$cat= $this->Category->read(null, $id);
	$this->set('category',$cat);
	$this->set('parent', $this->Category->findById($cat['Category']['parent_id']));
	$this->set('children', $this->Category->findAll('`Category`.`parent_id`='.$id));
	
	//allow products ot be sorted
	$this->Product->recursive=2;
	$criteria=null;
	list($order,$limit,$page) = $this->Pagination->init($criteria); // Added
	
	//NOTE: we use the relational table for the criteria and query
	$criteria='`ProductsCategory`.`category_id`='.$id;
	$data = $this->ProductsCategory->findAll($criteria, null, $order, $limit, $page); 
	$this->set('products', $data);
}

This will set up two variables to be used by our view, _$category_ and _$products_.

views/categories/view.thtml
---------------------------

### Products in this Category

	setPaging($paging); // Initialize the pagination variables
		/*
		*Create form to sort results
		*/
		echo $ajax->form(NULL,NULL,array("update" => $pagination->_pageDetails['ajaxDivUpdate'],"id"=>'paginationForm'));
		echo $pagination->resultsPerPageSelect()." ";
		$sorts = Array (
			"id::ASC::Product",
			"id::DESC::Product",
			"name::ASC::Product",
			"name::DESC::Product",
		);
		echo $pagination->sortBySelect($sorts);
		echo $ajax->submit("Submit",array("update" => $pagination->_pageDetails['ajaxDivUpdate'],"id"=>'paginationSubmit'));
		echo $ajax->observeForm('paginationForm',array("frequency"=>1,"update" => $pagination->_pageDetails['ajaxDivUpdate']));
		echo "document.getElementById('paginationSubmit').hide();";
		foreach ($products as $output)
		{
			//create td for values to add to array
			$values=" ";
			if($output['Product']['isorganic']==1) $values.= '[![Organic](/img/value_icons/organic.png)](/info/organic "Learn about this icon")';
			if($output['Product']['isnatural']==1) $values.=  '[![Natural](/img/value_icons/natural.png)](/info/natural "Learn about this icon")';
			if($output['Product']['isrecycled']==1) $values.=  '[![Recycled](/img/value_icons/recycled.png)](/info/recycled "Learn about this icon")';
			if($output['Product']['isdonation']==1) $values.=  '[![Donations Made](/img/value_icons/donates.png)](/info/donates "Learn about this icon")';
			$actions=' ';
			if($rights>=2) $actions.='   '.$html->link('Edit','/products/edit/' . $output['Product']['id']);
			if($rights==4) $actions.='   '.$html->link('Delete','/products/delete/' . $output['Product']['id'], null, 'Are you sure you want to delete id ' . $output['Product']['name']);
			$id=$output['Product']['id'];
			$title=$html->link($output['Product']['name'], $goto.$output['Product']['id']);
			$company=$output['Product']['Company']['name'];
			$description=$output['Product']['description'];
			$image=$html->image('uploads/'.$output['Product']['imageurl'],array('width'=>'120','alt'=>'Product Image'));
			echo '

';
				echo '';
					echo '';
					echo ''.
					'';
					echo '';
					echo '';
				echo '

'.$title.'
----------

'.$image.'

###  Produced by: '.$company.
					'

'.$description.'

######  Added on '.
					$date->regularize($output['Product']['dateAdded']).
					'

'.$values.'

'.$actions.'

';
			echo '

';
		}//end for each record
		echo $this->renderElement('pagination');
	else:
		// no products
		echo '

#### No Products have been assigned to this Category

';
		echo 'You may assign Categories while viewing a '.$html->link('Product','/products').'.';
	endif;
	?>
	

Now in oder for the query you set up in the controller to work you need to have the proper associations in the product model, the category model, and the products_category model.

models/Products_category.php
----------------------------

 VALID_NOT_EMPTY,
				'description' => VALID_NOT_EMPTY,
			);
	var $recursive = -1;
	
	var $hasMany = array (
			'Alternatives' => array(
					'className' => 'Alternative',
					'conditions'=>'',
					'order'=>'Alternatives.name',
					'foreignkey'=>'category_id'
					)
			);
	var $hasAndBelongsToMany = array(
			'Product' => array(
					'className'=> 'Product',
					'joinTable'      => 'products_categories',
					'foreignKey'      => 'category_id',
					'associationForeignKey'      => 'product_id',
					'conditions'      => '',
					'order'      => 'Product.name',
					'limit'      => '',
					'unique'      => true,
					'finderQuery'      => '',
					'deleteQuery'      => ''
				)
			);
}
?>
