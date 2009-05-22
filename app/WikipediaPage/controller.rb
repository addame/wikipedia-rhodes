require 'rho/rhocontroller'
require 'rho/rhosupport'
require 'rhom/rhom_source' 
 
class WikipediaPageController < Rho::RhoController
  include Rhom
  
  # GET /WikipediaPage
  def index
    @search = "::Home"
    render :action => :index
  end
  
  # shows there was an error with option to retry
  def error_page
     @search = @params["search"]
     render :action => :error_page
  end
  
  def page_loaded
    page = WikipediaPage.find(:first, {:conditions => {:title => @params["title"]}})
    if page
      page.save
    else
      WikipediaPage.new(:title => @params["title"], :lang => "en").save 
    end
    ""
  end
  
   # GET /WikipediaPage/history
  def history
    if @params['clear']
      WikipediaPage.delete_all
    end
    
    @pages = WikipediaPage.find(:all, {:order => 'updated_at'})
    @pages = @pages.reverse
    if @params['ajax']
      render :action => :history, :layout => false
    else
      render :action => :history
    end
  end
end