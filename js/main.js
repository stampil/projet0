var auto_switch = false;
var name_ship ='';
var nb_ship='';
var c;
var ctx;
var help_menu_left =null;
var timer_alert=null;
var API_SC=0;
var theme='b';
var allow_swipe=true;



$( document ).on( "pagecreate", "#page", function() {
    $( document ).on( "swipeleft swiperight", "#page", function( e ) {
    	if(!allow_swipe) return false;
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
            if ( e.type === "swipeleft" ) {
                $( "#right-panel" ).panel( "open" );
            } else if ( e.type === "swiperight" ) {
                $( "#left-panel" ).panel( "open" );
            }
        }
    });
});

function onDeviceReady() {
    if(navigator.splashscreen) navigator.splashscreen.hide();

    $(document).ready(function () {
    	
    	

    	c=document.getElementById("canvas");
    	ctx=c.getContext("2d");
        ctx.fillStyle='#151515';
        ctx.font='10px borbitron';
        ctx.fillText(' ', 10, 10);
        ctx.font='10px "orbitron"';
        ctx.fillText(' ', 10, 10);

        $('.handle').show(500);

        display_ship();
        
        $('#left-menu').click(function(){
        	console.log('left clicked');
        	clearTimeout(help_menu_left);
            help_menu_left = -1;
        });

        if ($.cookie('switch-theme') == '1') {
            console.log('cookie make click');
            auto_switch = true;
            setTimeout(function () {
                $('.ui-flipswitch').trigger('click');
            }, 501);

        }
        if($.cookie('handle')){
            $('#pseudo').val($.cookie('handle'));
            setTimeout(function(){
                $('#search_pseudo').trigger('click');
            },1000);

        }

        $("ul.ui-listview li a").click(function () {
        	
            var page = $(this).attr('goto');
            if (!page) return false; //li a :close is not a page
            
            allow_swipe = true;
            
            if($(this).attr('need_handle')=='1' && !$.cookie('handle')){
                page='error_need_handle';
            }

            $('.page').hide(300);
            $('.' + page).show(500);
            if (page == 'manage_ship') {
            	allow_swipe = false;
                setTimeout(function () {
                    $('.slide').trigger("resize");
                    $('.save_ship').button();
                    $('.save_ship').parent().width(175);
                }, 1000);
            }


            $('#close_left_menu').trigger('click');
            return false;
        });
        
                

        $('.ui-flipswitch').click(function () {
            console.log('switch auto:' + auto_switch + ' cookie' + $.cookie('switch-theme'));
            if ($('.ui-flipswitch-active').length) {
                $.cookie('switch-theme', 1);
                $('.ui-body-b').removeClass('ui-body-b').addClass('ui-body-a');
                $('.ui-page-theme-b').removeClass('ui-page-theme-b').addClass('ui-page-theme-a');
                theme='a';

            }
            else {
                $('.ui-body-a').removeClass('ui-body-a').addClass('ui-body-b');
                $('.ui-page-theme-a').removeClass('ui-page-theme-a').addClass('ui-page-theme-b');
                theme='b';
                if (!auto_switch) $.cookie('switch-theme', '');
            }
            auto_switch = false;
        });

        translate();

        $('body').delegate('#confirm_btn_1', 'click', function () {
            if ($(this).attr('action') == 'confirm_ship') {
                save_ship();
            }
            $('#confirm').hide();
        });
        
        $('body').delegate('.img_team_team, .img_team_hangar','click', function(){
        	alerte($(this).attr('alt'));
        });


        $('body').delegate('.save_ship', 'click', function () {
            name_ship = $(this).attr('ship');
            nb_ship= $('#slider').val();

            $( "#popupDialog h1" ).html(trad_save_nb_ship);
            $('#confirm_btn_1').html(trad_confirm_yes);
            $('#confirm_btn_1').attr('action','confirm_ship');
            $('#confirm_btn_2').html(trad_confirm_no);
            $( "#popupDialog h3" ).html(trad_confirm_nb_ship.replace('$0', $.cookie('pseudo')).replace('$1',nb_ship).replace('$2',name_ship) + '? ');

            $( "#popupDialog" ).popup("open");
        });

        $("#lang :radio[value='" + lang + "']").attr('checked', 'checked');
        $("#lang :radio").checkboxradio("refresh");

        $('#lang :radio').change(
            function () {
                $('a[href="#add-form"]').trigger('click');
                setTimeout(function () {
                    location.href = location.protocol + '//'
                        + location.host + location.pathname
                        + '?lang=' + $("#lang :radio:checked").val();
                }, 100);

            });
        
        $('#alert').click(function(){
        	$('#alert').slideUp(50);
        });

        $('#search_pseudo').click(function () {
            $('#member_guilde').html('');
            $('#info_pseudo').html('');

            var handle = 'gourmand';
            if ($('#pseudo').val()) {
                handle = $('#pseudo').val();

            }



            $.ajax({
                type: 'GET',
                url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
                jsonpCallback: 'API_SC'+API_SC++,
                contentType: "application/json",
                dataType: 'jsonp',
                data: 'action=citizens&page='+ handle,
                async: true,
                beforeSend: function(){
                    $('#info_pseudo').html('<div class="waitingForConnection">'+trad_connection_internet+'</div>');


                },
                success: function (data) {

                    if (data.join_date.year) {
                    	$('#canvas').show(500);


                        /*$('#info_pseudo').html(
                            '<img style="width:76px;height:76px;" src="'+ data.avatar
                                + '" /><img src="'+ data.team.logo+ '" style="width:76px;height:76px;" /><div>'+ data.title+ ' '+ data.pseudo + ' ('+ data.handle  + ')<br />'
                                + trad_your_team+': '+data.team.name
                                + ' (' + data.team.tag+ ') <br /> '
                                + data.team.nb_member + '</div><div>'+trad_inscrit_le+': '+ data.join_date.month   + '  '
                                + data.join_date.year + '</div><div><span trad="trad_country"></span>: '  + data.live.country
                                + '</div><div>'+trad_background+': ' + data.bio + '</div>');*/
                    	ctx.clearRect(0,0,$('#canvas').width(),$('#canvas').height());
                        var link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.type = 'text/css';
                        link.href = 'http://fonts.googleapis.com/css?family=Vast+Shadow';
                        document.getElementsByTagName('head')[0].appendChild(link);

                        ctx.font='10px borbitron';
                        
                        var metrics;
                        var width;
                        var font=18;
                        var upp_pseudo = data.pseudo.toUpperCase();

                        do{
                        	ctx.font=font+'px borbitron';
	                        metrics = ctx.measureText(upp_pseudo );
	                        width = metrics.width;
	                        console.log('width:'+width+' font:'+font);
	                        font--;
                        }
                        while(width>178 && font>9);
                        ctx.fillText( upp_pseudo,120,110);

                        while(data.number.length<8){
                            data.number= '0'+data.number;

                        }
                        ctx.save();
                        ctx.font='10px orbitron';
                        ctx.fillStyle='#151515';
                        ctx.translate(150, 94.5);
                        ctx.rotate(Math.PI/2);
                        ctx.fillText(data.number, -50, 147);
                        ctx.restore();


                        var img = new Image();   // Crée un nouvel objet Image
                        img.src = data.avatar; // Définit le chemin vers sa source
                        img.onload = function(){
                        	//ctx.drawImage(img, 220, 25,76,76);
                        	ctx.drawImage(img, 0, 0, img.width, img.height, 217, 27, 76, 61);
                        };
                        
                        if(data.team.logo){
	                        var img2 = new Image();
	                        img2.src = data.team.logo;
	                        img2.onload = function() {
	                            ctx.save();
	                            ctx.globalAlpha = 0.3;
	                            ctx.drawImage(img2, 0, 0, img2.width, img2.height, 125, 27, 76, 61);
	                            ctx.restore();
	                        };
                        }


                        $('#info_pseudo').html('');
                        
                        
                        
                        translate();

                        $.cookie('team',data.team.tag);
                        $.cookie('handle', data.handle);
                        $.cookie('pseudo', data.pseudo);
                        display_hangar();
                        if(data.team.name) info_orga();
                        
                        if(help_menu_left != -1) {
                            help_menu_left = setTimeout(function(){
                            	$( "#left-panel" ).panel( "open" );
                            },5000);
                        }
                        

                       

                    } else {
                        $('#info_pseudo').html(
                            trad_error_handle);
                    }
                },
                error: function (e) {
                    console.log(e.message);
                }
            });

        });
        $(document).trigger("pagecreate");
    });

}
document.addEventListener("deviceready", onDeviceReady, false);




//switch theme end


function save_ship(){
    $.ajax({
        type: 'GET',
        url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
        jsonpCallback: 'API_SC'+API_SC++,
        contentType: "application/json",
        dataType: 'jsonp',
        data: 'action=save_ship&ship='+ name_ship+ '&nb='+nb_ship+'&handle='+ $.cookie('handle'),
        async: true,
        success: function (data) {
            alerte(nb_ship+ 'x '+name_ship+ ' '+trad_saved);
            display_hangar();
        },
        error: function (e) {
            console.log(e.message);
        }
    });
}

function translate() {
    $('body').find("[trad]").each(function (index, value) {
        $(this).html(eval($(this).attr('trad')));
    });
}

function display_hangar() {
    $('#your_hangar').html(trad_loading_your_ship);
    $.ajax({
            type: 'GET',
            url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
            jsonpCallback: 'API_SC'+API_SC++,
            contentType: "application/json",
            dataType: 'jsonp',
            data: 'action=get_ship&handle='+ $.cookie('handle'),
            async: true,
            success: function (data) {
                $('#your_hangar').html('<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-'+theme+'"><h3 trad="trad_your_ships"></h3></div><div class="ui-body ui-body-'+theme+'">');
                var html = $.cookie('pseudo')+':<br />';
                for (var i = 0; i < data.ship.nb_res; i++) {
                    html +=  '<div class="content_team_hangar"><div class="nb_team_hangar">'+data.ship[i].nb +'x</div><img class="img_team_hangar" src="'+data.ship[i].img+'" alt="'+data.ship[i].name+'" /></div> ';
                }
                html+='</div></div></div>';
                $('#your_hangar').html(html);
                translate();

            },
            error: function (e) {
                console.log(e.message);
            }
        });
}

function save_infoship(nom,img,role,crew){

	$.ajax({
        type: 'GET',
        url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
        jsonpCallback: 'API_SC'+API_SC++,
        contentType: "application/json",
        dataType: 'jsonp',
        data: 'action=save_infoship&nom='+nom+'&img='+img+'&role='+role+'&crew='+crew,
        async: true,
        success: function (data) {
        },
        error: function (e) {
            console.log(e.message);
        }
    });
}

function display_ship() {
    $('#member_ship').html(
            '<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-'+theme+'"><h3 trad="trad_manage_ship"></h3></div><div class="ui-body ui-body-'+theme+'">'+
            '<div class="slider"><ul class="slides"><li trad="trad_loading_your_ship"></li></ul></div></div></div>');

    var date_save = new Date();
    var check_cook = date_save.getMonth()+1+''+date_save.getFullYear();

    $.ajax({
            type: 'GET',
            url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
            jsonpCallback: 'API_SC'+API_SC++,
            contentType: "application/json",
            dataType: 'jsonp',
            data: 'action=ship',
            async: true,
            success: function (data) {
                $('#ship, .slides').html('');
                var html = '';
                var check_banu = false;
                var check_karthu = false;
                var check_mustang = false;
                for (var i = 0; i < data.ship.total; i++) {
                    html += ' <li class="slide"><img src="https://robertsspaceindustries.com/rsi/static/images/game/ship-specs/'
                        + data.ship[i].imageurl  + '" /><br />'
                        + data.ship[i].title
                        + ' ('   + data.ship[i].manufacturer   + ')<br />'
                        + trad_max_crew  + ': '
                        + data.ship[i].maxcrew
                        + '<br />'
                        + trad_role +': ' + data.ship[i].role
                        + '<br /><input type="button" class="save_ship" ship="'
                        + data.ship[i].title  + '" value="'
                        + trad_save_nb_ship + '" />' + '</li>';
                    if(data.ship[i].title.match('banu')){
                        check_banu = true;
                    }
                    else if(data.ship[i].title.match('karthu')){
                        check_karthu = true;
                    }
                    else if(data.ship[i].title.match('mustang')){
                        check_mustang = true;
                    }
                    if(!$.cookie(check_cook) ) save_infoship(data.ship[i].title, 'https://robertsspaceindustries.com/rsi/static/images/game/ship-specs/'+data.ship[i].imageurl, data.ship[i].role, data.ship[i].maxcrew);
                }

                if(!check_banu){
                    html +=' <li class="slide"><img src="img/banu.jpg" /><br />Banu Merchantman (Birc)<br />'
                        + trad_max_crew  + ': 4<br />'
                        + trad_role +': Merchant Clipper'
                        + '<br /><input type="button" class="save_ship" ship="Banu Merchantman" value="'
                        + trad_save_nb_ship + '" />' + '</li>';
                }
                if(!check_karthu){
                    html +=' <li class="slide"><img src="img/karthu.jpg" /><br />Xi’An Karthu<br />'
                        + trad_max_crew  + ': 1<br />'
                        + trad_role +': Scout'
                        + '<br /><input type="button" class="save_ship" ship="Xi’An Karthu" value="'
                        + trad_save_nb_ship + '" />' + '</li>';
                }
                if(!check_mustang){
                    html +=' <li class="slide"><img src="img/mustang.jpg" /><br />Mustang (Consolidated Outland)<br />'
                        + trad_max_crew  + ': 1<br />'
                        + trad_role +': Light Fighter'
                        + '<br /><input type="button" class="save_ship" ship="Mustang" value="'
                        + trad_save_nb_ship + '" />' + '</li>';
                }

                $('.slides').html(html);
                $('#nb_ship').show();

                $('.slider').glide({
                    autoplay: false
                });
                translate();
                $.cookie(check_cook,1);
                $('.slider-arrow--left').html('<');
                $('.slider-arrow--right').html('&gt;');
            },
            error: function (e) {
                console.log(e.message);
            }
        });
}

function info_orga() {

    $.ajax({
            type: 'GET',
            url: 'http://vps36292.ovh.net/mordu/API_2.8.php',
            jsonpCallback: 'API_SC'+API_SC++,
            contentType: "application/json",
            dataType: 'jsonp',
            data: 'action=org&team=' + $.cookie('team') + '&page=1',
            async: true,
            beforeSend: function(){
                $('#member_guilde').html('<div class="waitingForConnection">'+trad_connection_internet+'</div>');
            },
            success: function (data) {
                var html = '<div class="ui-corner-all custom-corners"><div class="ui-bar ui-bar-'+theme+'"><h3 trad="trad_your_team"></h3></div><div class="ui-body ui-body-'+theme+'">';
                var hangar_teammate='';
                var hangar_team ='';
                $('#member_guilde').html();

                if (data.member.nb > 0) {
                	if(data.member.nb>249) data.member.nb = 249; //TODO limite max 249
                    for (var i = 0; i < data.member.nb; i++) {
                    	hangar_teammate='';
                    	for(var j=0; j<data.member[i].ship.nb;j++){
                    		hangar_teammate+= '<div class="content_team_hangar"><div class="nb_team_hangar">'+data.member[i].ship[j].nb +'x</div><img class="img_team_team" src="'+data.member[i].ship[j].img+'" alt="'+data.member[i].ship[j].name+'" /></div> ';
                    	}
                    	//hangar_teammate = hangar_teammate.substring(0, hangar_teammate.length - 2);
                        
                    	html += '<div><img class="member_guilde_avatar" src="http://robertsspaceindustries.com'+ data.member[i].avatar  + '" style="'+(data.member[i].ship.nb>0?'border-color:#2ad':'border-color:gray')+'" />'
                            + ' <div class="display_pseudo">' + data.member[i].pseudo + '</div><div class="display_handle"> ' + data.member[i].handle + '</div>'
                            
                            + '<div>'+data.member[i].title+'</div>'
                            + '<div style="clear:both"></div><h2 trad="trad_role"></h2><ul>'
                            + data.member[i].role.replace('None','- '+trad_none)
                            + '</ul></div>'
                            +'<div class="hangarteam" handle="' + data.member[i].handle + '">'+hangar_teammate+'</div>'
                            +'<hr />';
                            
                    }
                    html += '</div></div>';

                    for(var i=0; i< data.team.nb; i++){
                        hangar_team+= '<div class="content_team_hangar"><div class="nb_team_hangar">'+data.team[i].nb+'x</div><img class="img_team_hangar" src="'+data.team[i].img+'" alt="'+data.team[i].name+'" /></div> ';
                    }

                    $('#team_hangar').html($.cookie('team')+': <br />'+hangar_team);
                    $('#member_guilde').html(html);
                    translate();
                } else {
                    $('#member_guilde').html(trad_error_info_org);
                }
            },
            error: function (e) {
                console.log(e.message);
            }
        });
}


function alerte(txt){
	clearTimeout(timer_alert);
	timer_alert=null;
	$('#alert').html(txt);
	$('#alert').slideDown(150);
	timer_alert = setTimeout(function(){
		$('#alert').slideUp(500);
	},6000);
	
}
