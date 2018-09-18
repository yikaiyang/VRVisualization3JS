<template>
     <div class="ui menubar-collapsed" id="menubar">
        <div class="menubar-container" onclick="closeMenu()">
                <div class="menubutton isactive">
                    <div class="upperbar"></div>
                    <div class="middlebar"></div>
                    <div class="lowerbar"></div>
                </div>
                <nav>
                    <ul v-bind:key="item.name" 
                        v-for="(item, index) in menuItems"
                        >
                        <!--v-on:Click="{handleMenuItemClick(index)}" -->
                        <li 
                            class="menu-item"
                            
                        >
                            <router-link :to="{ path: item.route || '/'}">{{item.name}}</router-link>
                        </li>
                    </ul>
                </nav>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Menubar',
    data: function() {
        return {
            isMenuVisible: false,
            menuItems: [
                {
                    name: 'Explore Map',
                    route: '/'
                },
                {
                    name: 'Visualization',
                    route: '/visualization'
                },
                {
                    name: 'Settings',
                    route: '/settings'
                }
            ],
            selectedMenuItemIndex: 0, 
        }
    }
}
</script>

<style>
    #menubar {
        background-color: #000914;
        position: absolute;
        width: 280px;
        min-height: 100%;
        height: 100%;
        color: white;
        z-index: 101;
        cursor: default;
        transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0);
    }

    .menubar-collapsed {
        transform-origin: 0% 0%;
        transform: translate(-100%, 0);
    }

    .menubar-visible {
        transform-origin: 0% 0%;
        transform: translate(0%, 0);
    }

    .menubar-container {
        padding-left: 58px;
    }

    #menubar nav {
        margin-top: 58px;
    }

    #menubar nav ul {
        /** Remove bootstrap padding*/
        list-style: none;
        margin-left: 0;
        padding-left: 0;
    }

    nav a {
        all: unset;
    }

     nav a:hover {
        all: unset;
    }

    .menubutton {
        height: 16px;
        width: 16px;
        padding: 18px;
        padding-left: 0px;
        margin-top: 14px;
        display: inline-block;
        cursor: pointer;
    }

    .menubutton:hover div{
        background-color: #FFFFFF;;
    }

    .menubutton div{
        height: 2px;
        width: 16px;
        background-color: #A2A2A2;;
        margin-bottom: 3px;
    }

    /**
    * Menu button in expanded sidebar state.
    */
    .menubutton.isactive{
        margin-bottom: 0px;
    }

    .menubutton.isactive .upperbar{
        transform: rotate(-45deg) translate(-6px, 6px);
    }

    .menubutton.isactive .middlebar{
        opacity: 0;
    }

    .menubutton.isactive .lowerbar{
        transform: rotate(45deg) translate(-1px, -1px);
    }

    /**
    *  Menu items in navigation bar (Explore maps/Visualization/Settings)
    **/

    .menu-item {
        font: 28pt;
        color: #A2A2A2;
        margin-top: 28px;
        cursor: pointer;
    }

    .menu-item:hover {
        font: 28pt;
        color: #FFFFFF;
        margin-top: 28px;
    }

    .menu-item-active {
        font-weight: bold;
        color: #FFFFFF;
    }
</style>
