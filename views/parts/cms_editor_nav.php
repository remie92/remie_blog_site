<div class="cms_nav">
    <ul class="cms_nav">
        <?php
        foreach ($tables as $table) {
            $style_add="";
            if ($selected["id"]==$table["id"]){$style_add='style="font-weight: bolder; background-color: #555555;"';}
            echo '<li class="cms_nav"><a '. $style_add .' class="cms_nav" href="/cms/editor?selected='.$table["id"].'">'.str_replace('_',' ',ucfirst($table["name"])).'</a></li>';
        }
        ?>

    </ul>
</div>